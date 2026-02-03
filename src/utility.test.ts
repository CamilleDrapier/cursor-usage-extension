import { describe, it, expect } from 'vitest'
import { daysBetween } from './utility'

describe('daysBetween', () => {
  it('returns 0 for the same date', () => {
    const date = new Date('2024-01-15')
    expect(daysBetween(date, date)).toBe(0)
  })

  it('calculates days between two dates correctly', () => {
    const date1 = new Date('2024-01-01')
    const date2 = new Date('2024-01-31')
    expect(daysBetween(date1, date2)).toBe(30)
  })

  it('calculates days between months correctly', () => {
    const date1 = new Date('2024-01-14')
    const date2 = new Date('2024-02-14')
    const date3 = new Date('2024-03-14')
    expect(daysBetween(date1, date2)).toBe(31)
    expect(daysBetween(date2, date3)).toBe(29)
  })

  it('returns absolute value regardless of date order', () => {
    const date1 = new Date('2024-01-01')
    const date2 = new Date('2024-01-15')
    expect(daysBetween(date1, date2)).toBe(daysBetween(date2, date1))
  })

  it('handles month boundaries correctly', () => {
    const date1 = new Date('2024-01-31')
    const date2 = new Date('2024-02-01')
    expect(daysBetween(date1, date2)).toBe(1)
  })

  it('handles year boundaries correctly', () => {
    const date1 = new Date('2023-12-31')
    const date2 = new Date('2024-01-01')
    expect(daysBetween(date1, date2)).toBe(1)
  })

  it('handles leap year correctly', () => {
    const date1 = new Date('2024-02-28')
    const date2 = new Date('2024-03-01')
    expect(daysBetween(date1, date2)).toBe(2)
  })

  it('handles non-leap year correctly', () => {
    const date1 = new Date('2023-02-28')
    const date2 = new Date('2023-03-01')
    expect(daysBetween(date1, date2)).toBe(1)
  })
})
