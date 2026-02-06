import { observeAndProcessElement } from './utility'
import { gatherUsageData, analyzeUsage } from './analysis'
import { getOrcreateFillerElement, updateProgressBar } from './ui'
import { SELECTORS, EXTENSION_MARKER } from './constants'

const isAlreadyInitialized = (): boolean => {
  return document.body.hasAttribute(EXTENSION_MARKER)
}

const markAsInitialized = (): void => {
  document.body.setAttribute(EXTENSION_MARKER, 'true')
}

const main = async (): Promise<void> => {
  if (isAlreadyInitialized()) return Promise.resolve()
  markAsInitialized()

  return observeAndProcessElement(SELECTORS.USAGE_LABEL_XPATH, (matchingElement) => {
    const usageData = gatherUsageData(matchingElement)
    const analysis = analyzeUsage(usageData)

    const percentageElement = document.querySelector(SELECTORS.PROGRESS_BAR)
    if (!percentageElement) return

    const fillerElement = getOrcreateFillerElement(analysis)
    updateProgressBar(percentageElement, fillerElement, analysis)
  })
}

main().catch((error: unknown) => {
  document.body.removeAttribute(EXTENSION_MARKER)

  const message = error instanceof Error ? error.message : String(error)
  console.error('[Cursor Usage Tracker] Failed to initialize:', message)
})
