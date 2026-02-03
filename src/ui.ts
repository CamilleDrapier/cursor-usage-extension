import type { UsageAnalysis } from './types'
import { COLORS, ANIMATION } from './constants'

export function createFillerElement(analysis: UsageAnalysis): HTMLDivElement {
  const filler = document.createElement('div')

  filler.style.backgroundColor = analysis.isOverUsage ? COLORS.OVER_USAGE : COLORS.UNDER_USAGE
  filler.style.height = '100%'
  filler.style.borderTopRightRadius = '2px'
  filler.style.borderBottomRightRadius = '2px'

  if (analysis.isOverUsage) {
    const overagePercent = analysis.currentPercentage - analysis.idealPercentage
    filler.style.width = `${overagePercent * 100}%`
    filler.title = `You are ahead of your ideal usage by about ${analysis.differenceRequests} requests`
  } else {
    const underagePercent = analysis.idealPercentage - analysis.currentPercentage
    filler.style.width = `${underagePercent * 100}%`
    filler.title = `You are behind your ideal usage by about ${analysis.differenceRequests} requests`
  }

  return filler
}

export function applyPulseAnimation(element: HTMLElement): void {
  element.animate([{ opacity: ANIMATION.OPACITY_MIN }, { opacity: ANIMATION.OPACITY_MAX }], {
    duration: ANIMATION.DURATION_MS,
    iterations: Infinity,
    direction: 'alternate',
    easing: 'ease-in-out',
  })
}

export function updateProgressBar(percentageElement: Element, analysis: UsageAnalysis, fillerElement: HTMLDivElement): void {
  const htmlElement = percentageElement as HTMLElement
  htmlElement.style.borderTopRightRadius = '0'
  htmlElement.style.borderBottomRightRadius = '0'

  if (analysis.isOverUsage) {
    htmlElement.style.width = `${analysis.idealPercentage * 100}%`
  }

  const parent = percentageElement.parentElement
  if (parent) {
    parent.insertBefore(fillerElement, percentageElement.nextElementSibling)
  }
}
