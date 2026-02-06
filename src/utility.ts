const MS_PER_DAY = 24 * 60 * 60 * 1000

export const daysBetween = (date1: Date, date2: Date): number => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime())
  return Math.round(timeDiff / MS_PER_DAY)
}

const retrieveAndCallbck = (xpath: string, callback: (element: Element) => void): void => {
  const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as Element | null
  if (element) callback(element)
}

export const observeAndProcessElement = (xpath: string, callback: (element: Element) => void): void => {
  const observer = new MutationObserver(() => retrieveAndCallbck(xpath, callback))
  observer.observe(document.body, { childList: true, subtree: true })
  // Initial check in case the element is already present
  retrieveAndCallbck(xpath, callback)
}
