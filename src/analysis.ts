import type { UsageData, UsageAnalysis } from './types'
import { extractRequestCounts, extractAllowanceEndDate, calculateAllowanceStart } from './dom_extraction'

export class UsageDataValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UsageDataValidationError'
  }
}

export const gatherUsageData = (matchingElement: Element): UsageData => {
  const statsContainer = matchingElement.nextElementSibling
  if (!statsContainer) throw new Error('Could not find stats container')

  const { used, allowed } = extractRequestCounts(statsContainer)
  const allowanceEnd = extractAllowanceEndDate()

  return {
    usedRequests: used,
    allowedRequests: allowed,
    allowanceStart: calculateAllowanceStart(allowanceEnd),
    allowanceEnd,
    currentDate: new Date(),
  }
}

const validateUsageData = (data: UsageData): void => {
  if (data.allowedRequests <= 0) throw new UsageDataValidationError('allowedRequests must be a positive number')
  if (data.usedRequests < 0) throw new UsageDataValidationError('usedRequests cannot be negative')
  if (data.allowanceEnd <= data.allowanceStart) throw new UsageDataValidationError('allowanceEnd must be after allowanceStart')
  if (data.currentDate < data.allowanceStart) throw new UsageDataValidationError('currentDate cannot be before allowanceStart')
}

export const analyzeUsage = (data: UsageData): UsageAnalysis => {
  validateUsageData(data)

  const totalTime = data.allowanceEnd.getTime() - data.allowanceStart.getTime()
  const elapsedTime = data.currentDate.getTime() - data.allowanceStart.getTime()

  const idealPercentage = totalTime > 0 ? elapsedTime / totalTime : 0
  const currentPercentage = data.usedRequests / data.allowedRequests
  const isOverUsage = currentPercentage > idealPercentage
  const differenceRequests = Math.round(Math.abs(currentPercentage - idealPercentage) * data.allowedRequests)

  return {
    idealPercentage,
    currentPercentage,
    isOverUsage,
    differenceRequests,
  }
}
