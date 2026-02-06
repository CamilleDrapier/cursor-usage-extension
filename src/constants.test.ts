import { describe, it, expect } from 'vitest'
import { SELECTORS, COLORS, ANIMATION, EXTENSION_MARKER } from './constants'

describe('constants', () => {
  describe('SELECTORS', () => {
    it('has valid XPath for usage label', () => {
      expect(SELECTORS.USAGE_LABEL_XPATH).toContain('Included-Request Usage')
    })

    it('has valid CSS selector for progress bar', () => {
      expect(SELECTORS.PROGRESS_BAR).toContain('bg-')
    })

    it('has valid CSS selector for cycle end SVG', () => {
      expect(SELECTORS.CYCLE_END_SVG).toContain('tooltip')
    })
  })

  describe('COLORS', () => {
    it('has valid hex color for over usage', () => {
      expect(COLORS.OVER_USAGE).toMatch(/^#[0-9a-fA-F]{6}$/)
    })

    it('has valid hex color for under usage', () => {
      expect(COLORS.UNDER_USAGE).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
  })

  describe('ANIMATION', () => {
    it('has positive duration', () => {
      expect(ANIMATION.DURATION_MS).toBeGreaterThan(0)
    })

    it('has valid opacity values', () => {
      const minOpacity = parseFloat(ANIMATION.OPACITY_MIN)
      const maxOpacity = parseFloat(ANIMATION.OPACITY_MAX)
      expect(minOpacity).toBeGreaterThanOrEqual(0)
      expect(minOpacity).toBeLessThanOrEqual(1)
      expect(maxOpacity).toBeGreaterThanOrEqual(0)
      expect(maxOpacity).toBeLessThanOrEqual(1)
      expect(maxOpacity).toBeGreaterThan(minOpacity)
    })
  })

  describe('EXTENSION_MARKER', () => {
    it('is a valid data attribute name', () => {
      expect(EXTENSION_MARKER).toMatch(/^data-[a-z-]+$/)
    })
  })
})
