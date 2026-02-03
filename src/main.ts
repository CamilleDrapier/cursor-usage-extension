import { waitForElement } from './utility'
import { gatherUsageData, analyzeUsage } from './analysis'
import { createFillerElement, applyPulseAnimation, updateProgressBar } from './ui'
import { SELECTORS, EXTENSION_MARKER } from './constants'

function isAlreadyInitialized(): boolean {
  return document.body.hasAttribute(EXTENSION_MARKER)
}

function markAsInitialized(): void {
  document.body.setAttribute(EXTENSION_MARKER, 'true')
}

async function main(): Promise<void> {
  // Prevent duplicate initialization (e.g., if page updates without full reload)
  if (isAlreadyInitialized()) {
    return
  }
  markAsInitialized()

  const matchingElement = await waitForElement(SELECTORS.USAGE_LABEL_XPATH)

  const usageData = gatherUsageData(matchingElement)
  const analysis = analyzeUsage(usageData)

  const percentageElement = document.querySelector(SELECTORS.PROGRESS_BAR)

  if (!percentageElement) {
    throw new Error('Could not find percentage bar element')
  }

  const fillerElement = createFillerElement(analysis)
  applyPulseAnimation(fillerElement)
  updateProgressBar(percentageElement, analysis, fillerElement)
}

main().catch((error: unknown) => {
  document.body.removeAttribute(EXTENSION_MARKER)

  const message = error instanceof Error ? error.message : String(error)
  console.error('[Cursor Usage Tracker] Failed to initialize:', message)
})
