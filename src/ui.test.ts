import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createFillerElement, applyPulseAnimation, updateProgressBar } from './ui'
import type { UsageAnalysis } from './types'
import { COLORS, ANIMATION } from './constants'

beforeEach(() => {
  vi.stubGlobal('document', {
    createElement: vi.fn(() => ({
      style: {},
      title: '',
    })),
  })
})

describe('createFillerElement', () => {
  it('creates red element for over-usage', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.7,
      isOverUsage: true,
      differenceRequests: 100,
    }

    const element = createFillerElement(analysis)
    expect(element.style.backgroundColor).toBe(COLORS.OVER_USAGE)
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

    const element = createFillerElement(analysis)
    expect(element.style.backgroundColor).toBe(COLORS.UNDER_USAGE)
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

    const element = createFillerElement(analysis)
    expect(element.style.width).toBe('25%')
  })

  it('sets correct width for under-usage', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.75,
      currentPercentage: 0.5,
      isOverUsage: false,
      differenceRequests: 100,
    }

    const element = createFillerElement(analysis)
    expect(element.style.width).toBe('25%')
  })

  it('sets height to 100%', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.7,
      isOverUsage: true,
      differenceRequests: 100,
    }

    const element = createFillerElement(analysis)
    expect(element.style.height).toBe('100%')
  })

  it('sets borderRadius', () => {
    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.7,
      isOverUsage: true,
      differenceRequests: 100,
    }

    const element = createFillerElement(analysis)
    expect(element.style.borderTopRightRadius).toBe('2px')
    expect(element.style.borderBottomRightRadius).toBe('2px')
  })
})

describe('applyPulseAnimation', () => {
  it('calls animate with correct parameters', () => {
    const mockAnimate = vi.fn()
    const mockElement = { animate: mockAnimate } as unknown as HTMLElement

    applyPulseAnimation(mockElement)

    expect(mockAnimate).toHaveBeenCalledWith([{ opacity: ANIMATION.OPACITY_MIN }, { opacity: ANIMATION.OPACITY_MAX }], {
      duration: ANIMATION.DURATION_MS,
      iterations: Infinity,
      direction: 'alternate',
      easing: 'ease-in-out',
    })
  })
})

describe('updateProgressBar', () => {
  it('adjusts width for over-usage', () => {
    const mockPercentageElement = {
      style: { width: '70%' },
      parentElement: {
        insertBefore: vi.fn(),
      },
      nextElementSibling: null,
    } as unknown as Element

    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.7,
      isOverUsage: true,
      differenceRequests: 100,
    }

    const mockFiller = {} as HTMLDivElement

    updateProgressBar(mockPercentageElement, analysis, mockFiller)

    expect((mockPercentageElement as HTMLElement).style.width).toBe('50%')
  })

  it('does not adjust width for under-usage', () => {
    const mockPercentageElement = {
      style: { width: '30%' },
      parentElement: {
        insertBefore: vi.fn(),
      },
      nextElementSibling: null,
    } as unknown as Element

    const analysis: UsageAnalysis = {
      idealPercentage: 0.5,
      currentPercentage: 0.3,
      isOverUsage: false,
      differenceRequests: 100,
    }

    const mockFiller = {} as HTMLDivElement

    updateProgressBar(mockPercentageElement, analysis, mockFiller)

    expect((mockPercentageElement as HTMLElement).style.width).toBe('30%')
  })

  it('inserts filler element into parent', () => {
    const insertBeforeMock = vi.fn()
    const nextSibling = {}
    const mockPercentageElement = {
      style: { width: '30%' },
      parentElement: {
        insertBefore: insertBeforeMock,
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

    updateProgressBar(mockPercentageElement, analysis, mockFiller)

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

    const mockFiller = {} as HTMLDivElement

    expect(() => updateProgressBar(mockPercentageElement, analysis, mockFiller)).not.toThrow()
  })
})
