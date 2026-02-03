import { TIMING } from './constants'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function daysBetween(date1: Date, date2: Date): number {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime())
  return Math.round(timeDiff / MS_PER_DAY)
}

export function waitForElement(xpath: string, timeout = TIMING.ELEMENT_TIMEOUT_MS, pollInterval = TIMING.POLL_INTERVAL_MS): Promise<Element> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const check = (): void => {
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      const element = result.singleNodeValue as Element | null

      if (element) {
        resolve(element)
        return
      }

      if (Date.now() - startTime >= timeout) {
        reject(new Error(`Element not found within ${timeout}ms: ${xpath}`))
        return
      }

      setTimeout(check, pollInterval)
    }

    check()
  })
}
