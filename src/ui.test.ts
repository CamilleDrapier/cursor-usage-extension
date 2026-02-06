import { describe, it, expect, vi, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { getOrcreateFillerElement, updateProgressBar } from './ui'
import type { UsageAnalysis } from './types'

beforeEach(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
  global.document = dom.window.document
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.window = dom.window as any

  // Mock the animate function for HTMLElements
  Object.defineProperty(dom.window.HTMLElement.prototype, 'animate', {
    writable: true,
    value: vi.fn().mockReturnValue({
      finished: Promise.resolve(),
    }),
  })
})

describe('getOrcreateFillerElement', () => {
  it('creates red element for over-usage', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.7,
      isOverUsage: true,
      differenceRequests: 100,
    }

    const element = getOrcreateFillerElement(analysis)
    expect(element.style.backgroundColor).toBe('rgb(255, 107, 107)')
    expect(element.title).toContain('ahead')
    expect(element.title).toContain('100')
  })

  it('creates aquamarine element for under-usage', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.3,
      isOverUsage: false,
      differenceRequests: 100,
    }

    const element = getOrcreateFillerElement(analysis)
    expect(element.style.backgroundColor).toBe('rgb(127, 255, 212)')
    expect(element.title).toContain('behind')
    expect(element.title).toContain('100')
  })

  it('sets correct width for over-usage', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.75,
      isOverUsage: true,
      differenceRequests: 100,
    }

    const element = getOrcreateFillerElement(analysis)
    expect(element.style.width).toBe('25%')
  })

  it('sets correct width for under-usage', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.75,
      currentPercentage: 0.5,
      isOverUsage: false,
      differenceRequests: 100,
    }

    const element = getOrcreateFillerElement(analysis)
    expect(element.style.width).toBe('25%')
  })

  it('sets height to 100%', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.7,
      isOverUsage: true,
      differenceRequests: 100,
    }

    const element = getOrcreateFillerElement(analysis)
    expect(element.style.height).toBe('100%')
  })

  it('sets borderRadius', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.7,
      isOverUsage: true,
      differenceRequests: 100,
    }

    const element = getOrcreateFillerElement(analysis)
    expect(element.style.borderTopRightRadius).toBe('2px')
    expect(element.style.borderBottomRightRadius).toBe('2px')
  })
})

describe('updateProgressBar', () => {
  it('adjusts width for over-usage', () => {
    const mockPercentageElement = {
      style: { width: '70%' },
      parentElement: {
        insertBefore: vi.fn(),
        contains: vi.fn().mockReturnValue(true),
      },
      nextElementSibling: null,
    } as unknown as Element

    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.7,
      isOverUsage: true,
      differenceRequests: 100,
    }

    updateProgressBar(mockPercentageElement, {} as HTMLDivElement, analysis)

    expect((mockPercentageElement as HTMLElement).style.width).toBe('50%')
  })

  it('does not adjust width for under-usage', () => {
    const mockPercentageElement = {
      style: { width: '30%' },
      parentElement: {
        insertBefore: vi.fn(),
        contains: vi.fn().mockReturnValue(true),
      },
      nextElementSibling: null,
    } as unknown as Element

    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.3,
      isOverUsage: false,
      differenceRequests: 100,
    }

    updateProgressBar(mockPercentageElement, {} as HTMLDivElement, analysis)

    expect((mockPercentageElement as HTMLElement).style.width).toBe('30%')
  })

  it('inserts filler element into parent', () => {
    const insertBeforeMock = vi.fn()
    const nextSibling = {}
    const mockPercentageElement = {
      style: { width: '30%' },
      parentElement: {
        insertBefore: insertBeforeMock,
        contains: vi.fn().mockReturnValue(false),
      },
      nextElementSibling: nextSibling,
    } as unknown as Element

    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.3,
      isOverUsage: false,
      differenceRequests: 100,
    }

    const mockFiller = {} as HTMLDivElement
    vi.spyOn(document, 'getElementById').mockReturnValue(mockFiller)

    updateProgressBar(mockPercentageElement, {} as HTMLDivElement, analysis)

    expect(insertBeforeMock).toHaveBeenCalledWith(mockFiller, nextSibling)
  })

  it('handles missing parent gracefully', () => {
    const mockPercentageElement = {
      style: { width: '30%' },
      parentElement: null,
      nextElementSibling: null,
    } as unknown as Element

    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.3,
      isOverUsage: false,
      differenceRequests: 100,
    }

    expect(() => updateProgressBar(mockPercentageElement, {} as HTMLDivElement, analysis)).not.toThrow()
  })
})
