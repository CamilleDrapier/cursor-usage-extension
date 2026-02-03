export interface UsageData {
  usedRequests: number
  allowedRequests: number
  allowanceStart: Date
  allowanceEnd: Date
  currentDate: Date
}

export interface UsageAnalysis {
  idealPercentage: number
  currentPercentage: number
  isOverUsage: boolean
  differenceRequests: number
}
