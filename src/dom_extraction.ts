import { SELECTORS } from './constants'

export interface RequestCounts {
  used: number
  allowed: number
}

export const extractRequestCounts = (statsContainer: Element): RequestCounts => {
  const usedText = statsContainer.firstElementChild?.textContent ?? '0'
  const allowedText = statsContainer.lastElementChild?.textContent ?? '0'

  const used = Number(usedText) || 0
  const allowed = Number(allowedText.replace(/\D/g, '')) || 0

  return { used, allowed }
}

export const extractAllowanceEndDate = (doc: Document = document): Date => {
  const svgElement = doc.querySelector(SELECTORS.CYCLE_END_SVG)
  if (!svgElement) throw new Error('Could not find cycle end date element')

  const tooltipContent = svgElement.getAttribute('data-tooltip-content')
  if (!tooltipContent) throw new Error('Could not find tooltip content with end date')

  const date = new Date(tooltipContent)
  if (isNaN(date.getTime())) throw new Error(`Invalid date format in tooltip: ${tooltipContent}`)

  return date
}

export const calculateAllowanceStart = (allowanceEnd: Date): Date => {
  const start = new Date(allowanceEnd)
  const originalDay = allowanceEnd.getDate()

  start.setMonth(start.getMonth() - 1)

  if (start.getDate() !== originalDay) start.setDate(0)

  return start
}
