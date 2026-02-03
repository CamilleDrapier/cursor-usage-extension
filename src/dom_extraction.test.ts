import { describe, it, expect } from 'vitest'
import { extractRequestCounts, calculateAllowanceStart } from './dom_extraction'

describe('extractRequestCounts', () => {
  it('extracts used and allowed counts from element', () => {
    const mockElement = {
      firstElementChild: { textContent: '150' },
      lastElementChild: { textContent: '/ 500' },
    } as unknown as Element

    const result = extractRequestCounts(mockElement)
    expect(result.used).toBe(150)
    expect(result.allowed).toBe(500)
  })

  it('handles missing text content gracefully', () => {
    const mockElement = {
      firstElementChild: { textContent: null },
      lastElementChild: { textContent: null },
    } as unknown as Element

    const result = extractRequestCounts(mockElement)
    expect(result.used).toBe(0)
    expect(result.allowed).toBe(0)
  })

  it('handles missing child elements gracefully', () => {
    const mockElement = {
      firstElementChild: null,
      lastElementChild: null,
    } as unknown as Element

    const result = extractRequestCounts(mockElement)
    expect(result.used).toBe(0)
    expect(result.allowed).toBe(0)
  })

  it('strips non-numeric characters from allowed count', () => {
    const mockElement = {
      firstElementChild: { textContent: '100' },
      lastElementChild: { textContent: 'of 1,000 requests' },
    } as unknown as Element

    const result = extractRequestCounts(mockElement)
    expect(result.allowed).toBe(1000)
  })

  it('handles NaN values gracefully', () => {
    const mockElement = {
      firstElementChild: { textContent: 'abc' },
      lastElementChild: { textContent: 'xyz' },
    } as unknown as Element

    const result = extractRequestCounts(mockElement)
    expect(result.used).toBe(0)
    expect(result.allowed).toBe(0)
  })
})

describe('calculateAllowanceStart', () => {
  it('returns date one month before allowance end', () => {
    const allowanceEnd = new Date('2024-02-15')
    const result = calculateAllowanceStart(allowanceEnd)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(15)
    expect(result.getFullYear()).toBe(2024)
  })

  it('handles year boundary correctly', () => {
    const allowanceEnd = new Date('2024-01-15')
    const result = calculateAllowanceStart(allowanceEnd)
    expect(result.getMonth()).toBe(11)
    expect(result.getFullYear()).toBe(2023)
  })

  it('does not modify the original date', () => {
    const allowanceEnd = new Date('2024-03-15')
    const originalTime = allowanceEnd.getTime()
    calculateAllowanceStart(allowanceEnd)
    expect(allowanceEnd.getTime()).toBe(originalTime)
  })

  it('handles month overflow - March 31 to February', () => {
    const allowanceEnd = new Date('2024-03-31')
    const result = calculateAllowanceStart(allowanceEnd)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(29)
  })

  it('handles month overflow - March 31 to February (non-leap year)', () => {
    const allowanceEnd = new Date('2023-03-31')
    const result = calculateAllowanceStart(allowanceEnd)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(28)
  })

  it('handles month overflow - May 31 to April', () => {
    const allowanceEnd = new Date('2024-05-31')
    const result = calculateAllowanceStart(allowanceEnd)
    expect(result.getMonth()).toBe(3)
    expect(result.getDate()).toBe(30)
  })

  it('handles normal case without overflow', () => {
    const allowanceEnd = new Date('2024-04-15')
    const result = calculateAllowanceStart(allowanceEnd)
    expect(result.getMonth()).toBe(2)
    expect(result.getDate()).toBe(15)
  })
})
