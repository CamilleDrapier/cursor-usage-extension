import { describe, it, expect } from 'vitest'
import { analyzeUsage, UsageDataValidationError } from './analysis'
import type { UsageData } from './types'

describe('analyzeUsage', () => {
  it('identifies over-usage correctly', () => {
    const data: UsageData = {
      usedRequests: 300,
      allowedRequests: 500,
      allowanceStart: new Date('2024-01-01'),
      allowanceEnd: new Date('2024-01-31'),
      currentDate: new Date('2024-01-15'), // ~50% through
    }

    const result = analyzeUsage(data)
    expect(result.isOverUsage).toBe(true)
    expect(result.currentPercentage).toBe(0.6)
  })

  it('identifies under-usage correctly', () => {
    const data: UsageData = {
      usedRequests: 100,
      allowedRequests: 500,
      allowanceStart: new Date('2024-01-01'),
      allowanceEnd: new Date('2024-01-31'),
      currentDate: new Date('2024-01-15'), // ~50% through
    }

    const result = analyzeUsage(data)
    expect(result.isOverUsage).toBe(false)
    expect(result.currentPercentage).toBe(0.2)
  })

  it('calculates difference in requests', () => {
    const data: UsageData = {
      usedRequests: 250,
      allowedRequests: 500,
      allowanceStart: new Date('2024-01-01'),
      allowanceEnd: new Date('2024-01-31'),
      currentDate: new Date('2024-01-16'),
    }

    const result = analyzeUsage(data)
    expect(result.differenceRequests).toBeLessThan(25)
  })

  it('handles edge case of start date', () => {
    const data: UsageData = {
      usedRequests: 50,
      allowedRequests: 500,
      allowanceStart: new Date('2024-01-01'),
      allowanceEnd: new Date('2024-01-31'),
      currentDate: new Date('2024-01-01'),
    }

    const result = analyzeUsage(data)
    expect(result.idealPercentage).toBe(0)
    expect(result.isOverUsage).toBe(true)
  })

  it('handles zero used requests correctly', () => {
    const data: UsageData = {
      usedRequests: 0,
      allowedRequests: 500,
      allowanceStart: new Date('2024-01-01'),
      allowanceEnd: new Date('2024-01-31'),
      currentDate: new Date('2024-01-15'),
    }

    const result = analyzeUsage(data)
    expect(result.currentPercentage).toBe(0)
    expect(result.isOverUsage).toBe(false)
  })

  it('handles being exactly on pace', () => {
    const data: UsageData = {
      usedRequests: 250,
      allowedRequests: 500,
      allowanceStart: new Date('2024-01-01'),
      allowanceEnd: new Date('2024-01-31'),
      currentDate: new Date('2024-01-16'),
    }

    const result = analyzeUsage(data)
    expect(Math.abs(result.currentPercentage - result.idealPercentage)).toBeLessThan(0.1)
  })

  describe('validation', () => {
    it('throws error for zero allowedRequests', () => {
      const data: UsageData = {
        usedRequests: 100,
        allowedRequests: 0,
        allowanceStart: new Date('2024-01-01'),
        allowanceEnd: new Date('2024-01-31'),
        currentDate: new Date('2024-01-15'),
      }

      expect(() => analyzeUsage(data)).toThrow(UsageDataValidationError)
      expect(() => analyzeUsage(data)).toThrow('allowedRequests must be a positive number')
    })

    it('throws error for negative allowedRequests', () => {
      const data: UsageData = {
        usedRequests: 100,
        allowedRequests: -500,
        allowanceStart: new Date('2024-01-01'),
        allowanceEnd: new Date('2024-01-31'),
        currentDate: new Date('2024-01-15'),
      }

      expect(() => analyzeUsage(data)).toThrow(UsageDataValidationError)
    })

    it('throws error for negative usedRequests', () => {
      const data: UsageData = {
        usedRequests: -100,
        allowedRequests: 500,
        allowanceStart: new Date('2024-01-01'),
        allowanceEnd: new Date('2024-01-31'),
        currentDate: new Date('2024-01-15'),
      }

      expect(() => analyzeUsage(data)).toThrow(UsageDataValidationError)
      expect(() => analyzeUsage(data)).toThrow('usedRequests cannot be negative')
    })

    it('throws error when allowanceEnd is before allowanceStart', () => {
      const data: UsageData = {
        usedRequests: 100,
        allowedRequests: 500,
        allowanceStart: new Date('2024-01-31'),
        allowanceEnd: new Date('2024-01-01'),
        currentDate: new Date('2024-01-15'),
      }

      expect(() => analyzeUsage(data)).toThrow(UsageDataValidationError)
      expect(() => analyzeUsage(data)).toThrow('allowanceEnd must be after allowanceStart')
    })

    it('throws error when currentDate is before allowanceStart', () => {
      const data: UsageData = {
        usedRequests: 100,
        allowedRequests: 500,
        allowanceStart: new Date('2024-01-15'),
        allowanceEnd: new Date('2024-02-15'),
        currentDate: new Date('2024-01-01'),
      }

      expect(() => analyzeUsage(data)).toThrow(UsageDataValidationError)
      expect(() => analyzeUsage(data)).toThrow('currentDate cannot be before allowanceStart')
    })
  })
})
