export const SELECTORS = {
  USAGE_LABEL_XPATH: "//div[text()='Included-Request Usage']",
  PROGRESS_BAR: 'div[class="bg-[var(--color-dashboard-usage-accent)]"]',
  CYCLE_END_SVG: 'svg[data-tooltip-id="next-cycle-start-tooltip-2"]',
} as const

export const COLORS = {
  OVER_USAGE: '#ff6b6b',
  UNDER_USAGE: '#7fffd4',
} as const

export const ANIMATION = {
  DURATION_MS: 1400,
  OPACITY_MIN: '0.6',
  OPACITY_MAX: '1',
} as const

export const TIMING = {
  ELEMENT_TIMEOUT_MS: 10000,
  POLL_INTERVAL_MS: 500,
} as const

export const EXTENSION_MARKER = 'data-cursor-usage-tracker'
