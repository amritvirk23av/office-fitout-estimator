import { describe, expect, it } from 'vitest'
import {
  AREA,
  DEFAULT_CONFIG,
  calculateEstimate,
  workstationsFor,
  type Config,
} from './pricing'

const allPremium: Config = {
  squareFeet: 12_000,
  acoustic: 'premium',
  furniture: 'custom',
  av: 'full',
  lighting: 'circadian',
}

describe('workstationsFor', () => {
  it('derives roughly one workstation per 160 sq ft', () => {
    expect(workstationsFor(12_000)).toBe(75)
    expect(workstationsFor(2_000)).toBe(13)
  })
})

describe('calculateEstimate — default (all standard, 12,000 sq ft)', () => {
  const estimate = calculateEstimate(DEFAULT_CONFIG)

  it('prices the base fit-out at $165 / sq ft', () => {
    expect(estimate.lineItems.find((l) => l.key === 'base')?.amount).toBe(1_980_000)
  })

  it('sums hard cost, 12% fees and 5% contingency into the total', () => {
    expect(estimate.hardCost).toBe(2_398_000)
    expect(estimate.professionalFees).toBeCloseTo(287_760, 2)
    expect(estimate.contingency).toBeCloseTo(119_900, 2)
    expect(estimate.total).toBeCloseTo(2_805_660, 2)
  })

  it('lands near $234 / sq ft blended', () => {
    expect(estimate.blendedRatePerSf).toBeCloseTo(233.8, 1)
  })

  it('runs to a 12-week programme', () => {
    expect(estimate.weeks).toBe(12)
  })
})

describe('calculateEstimate — all premium (12,000 sq ft)', () => {
  const estimate = calculateEstimate(allPremium)

  it('reaches roughly $3.94M with a longer programme', () => {
    expect(estimate.hardCost).toBe(3_370_500)
    expect(estimate.total).toBeCloseTo(3_943_485, 2)
    expect(estimate.weeks).toBe(24)
  })

  it('costs meaningfully more than the standard spec at the same area', () => {
    const standard = calculateEstimate({ ...allPremium, acoustic: 'standard', furniture: 'basic', av: 'boardroom', lighting: 'standard' })
    expect(estimate.total / standard.total).toBeGreaterThan(1.3)
  })
})

describe('calculateEstimate — area handling', () => {
  it('clamps below the minimum up to the floor', () => {
    expect(calculateEstimate({ ...DEFAULT_CONFIG, squareFeet: 100 }).squareFeet).toBe(AREA.min)
  })

  it('clamps above the maximum down to the ceiling', () => {
    expect(calculateEstimate({ ...DEFAULT_CONFIG, squareFeet: 999_999 }).squareFeet).toBe(AREA.max)
  })

  it('falls back to the default area when given NaN', () => {
    expect(calculateEstimate({ ...DEFAULT_CONFIG, squareFeet: Number.NaN }).squareFeet).toBe(AREA.default)
  })

  it('scales total cost monotonically with area', () => {
    const small = calculateEstimate({ ...DEFAULT_CONFIG, squareFeet: 4_000 }).total
    const large = calculateEstimate({ ...DEFAULT_CONFIG, squareFeet: 30_000 }).total
    expect(large).toBeGreaterThan(small)
  })
})
