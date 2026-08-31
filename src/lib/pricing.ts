/* ------------------------------------------------------------------ *
 * Fit-out pricing model — indicative dummy figures.
 *
 * Square footage is the base quantity; every other line derives from it
 * or from the workstation count it implies. Costs are pitched for a
 * premium, whole-floor CAT-B commercial fit-out.
 *
 * Nothing here is a formal quotation.
 * ------------------------------------------------------------------ */

export const AREA = {
  min: 2_000,
  max: 40_000,
  step: 500,
  default: 12_000,
} as const

/** One workstation per this many square feet (premium density incl. collaboration space). */
export const SF_PER_WORKSTATION = 160

/** Base fit-out — always included. Demolition, partitions, ceilings, flooring, MEP distribution, paint, PM. */
export const BASE_RATE_PER_SF = 165

export const PROFESSIONAL_FEES_RATE = 0.12
export const CONTINGENCY_RATE = 0.05

export type AcousticTier = 'standard' | 'premium'
export type FurnitureTier = 'basic' | 'executive' | 'custom'
export type AvTier = 'boardroom' | 'full'
export type LightingTier = 'standard' | 'tunable' | 'circadian'

export interface Config {
  squareFeet: number
  acoustic: AcousticTier
  furniture: FurnitureTier
  av: AvTier
  lighting: LightingTier
}

export const DEFAULT_CONFIG: Config = {
  squareFeet: AREA.default,
  acoustic: 'standard',
  furniture: 'basic',
  av: 'boardroom',
  lighting: 'standard',
}

interface TierOption {
  id: string
  label: string
  note: string
  /** Weeks added to the procurement phase for long-lead items. */
  procurementWeeks: number
  /** Weeks added to the fit / installation phase. */
  fitWeeks: number
}

interface CategoryDef<T extends string> {
  key: keyof Omit<Config, 'squareFeet'>
  label: string
  options: Record<T, TierOption & { cost: (sf: number, workstations: number) => number }>
  order: T[]
}

export const ACOUSTIC: CategoryDef<AcousticTier> = {
  key: 'acoustic',
  label: 'Acoustic treatment',
  order: ['standard', 'premium'],
  options: {
    standard: {
      id: 'standard',
      label: 'Standard',
      note: 'Acoustic ceiling tiles and partition insulation to code.',
      cost: (sf) => sf * 8,
      procurementWeeks: 0,
      fitWeeks: 0,
    },
    premium: {
      id: 'premium',
      label: 'Premium',
      note: 'High-NRC baffles, wall panelling, sound-masking, isolated meeting rooms.',
      cost: (sf) => sf * 22,
      procurementWeeks: 2,
      fitWeeks: 0,
    },
  },
}

export const FURNITURE: CategoryDef<FurnitureTier> = {
  key: 'furniture',
  label: 'Ergonomic furniture',
  order: ['basic', 'executive', 'custom'],
  options: {
    basic: {
      id: 'basic',
      label: 'Basic',
      note: 'Task seating, sit-stand desks, standard storage.',
      cost: (_sf, ws) => ws * 2_200,
      procurementWeeks: 0,
      fitWeeks: 0,
    },
    executive: {
      id: 'executive',
      label: 'Executive',
      note: 'Designer task chairs, powered benching, lounge and collaboration settings.',
      cost: (_sf, ws) => ws * 4_800,
      procurementWeeks: 0,
      fitWeeks: 2,
    },
    custom: {
      id: 'custom',
      label: 'Custom',
      note: 'Bespoke millwork desks, specified designer furniture, executive suites.',
      cost: (_sf, ws) => ws * 8_500,
      procurementWeeks: 0,
      fitWeeks: 4,
    },
  },
}

export const AV: CategoryDef<AvTier> = {
  key: 'av',
  label: 'Smart AV integration',
  order: ['boardroom', 'full'],
  options: {
    boardroom: {
      id: 'boardroom',
      label: 'Boardroom',
      note: 'One boardroom: 4K conferencing, wireless presentation, scheduling panel.',
      cost: () => 85_000,
      procurementWeeks: 0,
      fitWeeks: 0,
    },
    full: {
      id: 'full',
      label: 'Full-floor',
      note: 'Every meeting and huddle space, digital signage, floor-wide control and paging.',
      cost: (sf) => 45_000 + sf * 9,
      procurementWeeks: 2,
      fitWeeks: 1,
    },
  },
}

export const LIGHTING: CategoryDef<LightingTier> = {
  key: 'lighting',
  label: 'Lighting & circadian',
  order: ['standard', 'tunable', 'circadian'],
  options: {
    standard: {
      id: 'standard',
      label: 'Standard',
      note: 'LED luminaires with zoned dimming and occupancy control.',
      cost: (sf) => sf * 6,
      procurementWeeks: 0,
      fitWeeks: 0,
    },
    tunable: {
      id: 'tunable',
      label: 'Tunable',
      note: 'Tunable-white fittings, DALI addressable control, scene presets.',
      cost: (sf) => sf * 14,
      procurementWeeks: 1,
      fitWeeks: 0,
    },
    circadian: {
      id: 'circadian',
      label: 'Circadian',
      note: 'Circadian-tuned lighting, daylight harvesting, per-space scheduling.',
      cost: (sf) => sf * 28,
      procurementWeeks: 2,
      fitWeeks: 1,
    },
  },
}

/** Flattened, UI-facing view of the tier categories — safe to map over without wrestling the generics. */
export interface UiOption {
  id: string
  label: string
  note: string
}
export interface UiCategory {
  key: keyof Omit<Config, 'squareFeet'>
  /** Specification code shown against the row, e.g. "02·A". */
  code: string
  label: string
  options: UiOption[]
}

export const UI_CATEGORIES: UiCategory[] = [ACOUSTIC, FURNITURE, AV, LIGHTING].map((category, i) => {
  const options = category.options as Record<string, TierOption>
  return {
    key: category.key,
    code: `02·${String.fromCharCode(65 + i)}`,
    label: category.label,
    options: (category.order as string[]).map((id) => ({
      id: options[id].id,
      label: options[id].label,
      note: options[id].note,
    })),
  }
})

export interface LineItem {
  key: string
  label: string
  /** e.g. "Premium", "Custom" — omitted for the base line. */
  tier?: string
  amount: number
}

export interface TimelinePhase {
  key: string
  label: string
  weeks: number
}

export interface Estimate {
  squareFeet: number
  workstations: number
  lineItems: LineItem[]
  hardCost: number
  professionalFees: number
  contingency: number
  total: number
  blendedRatePerSf: number
  timeline: TimelinePhase[]
  weeks: number
}

export function workstationsFor(squareFeet: number): number {
  return Math.round(squareFeet / SF_PER_WORKSTATION)
}

function clampArea(squareFeet: number): number {
  if (Number.isNaN(squareFeet)) return AREA.default
  return Math.min(AREA.max, Math.max(AREA.min, Math.round(squareFeet)))
}

function timeline(config: Config, squareFeet: number): TimelinePhase[] {
  const acoustic = ACOUSTIC.options[config.acoustic]
  const furniture = FURNITURE.options[config.furniture]
  const av = AV.options[config.av]
  const lighting = LIGHTING.options[config.lighting]

  const procurementAdd =
    acoustic.procurementWeeks + furniture.procurementWeeks + av.procurementWeeks + lighting.procurementWeeks
  const fitAdd = acoustic.fitWeeks + furniture.fitWeeks + av.fitWeeks + lighting.fitWeeks

  // Construction scales with floor area; one week per 2,500 SF above the minimum.
  const construction = Math.max(3, Math.ceil((squareFeet - AREA.min) / 2_500))

  return [
    { key: 'design', label: 'Design', weeks: 2 },
    { key: 'procurement', label: 'Procurement', weeks: 2 + procurementAdd },
    { key: 'construction', label: 'Construction', weeks: construction },
    { key: 'fit', label: 'Fit-out', weeks: 2 + fitAdd },
    { key: 'handover', label: 'Handover', weeks: 2 },
  ]
}

export function calculateEstimate(config: Config): Estimate {
  const squareFeet = clampArea(config.squareFeet)
  const workstations = workstationsFor(squareFeet)

  const acoustic = ACOUSTIC.options[config.acoustic]
  const furniture = FURNITURE.options[config.furniture]
  const av = AV.options[config.av]
  const lighting = LIGHTING.options[config.lighting]

  const lineItems: LineItem[] = [
    { key: 'base', label: 'Base fit-out', amount: squareFeet * BASE_RATE_PER_SF },
    { key: 'acoustic', label: 'Acoustic treatment', tier: acoustic.label, amount: acoustic.cost(squareFeet, workstations) },
    { key: 'furniture', label: 'Ergonomic furniture', tier: furniture.label, amount: furniture.cost(squareFeet, workstations) },
    { key: 'av', label: 'Smart AV integration', tier: av.label, amount: av.cost(squareFeet, workstations) },
    { key: 'lighting', label: 'Lighting & circadian', tier: lighting.label, amount: lighting.cost(squareFeet, workstations) },
  ]

  const hardCost = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const professionalFees = hardCost * PROFESSIONAL_FEES_RATE
  const contingency = hardCost * CONTINGENCY_RATE
  const total = hardCost + professionalFees + contingency

  const phases = timeline(config, squareFeet)
  const weeks = phases.reduce((sum, phase) => sum + phase.weeks, 0)

  return {
    squareFeet,
    workstations,
    lineItems,
    hardCost,
    professionalFees,
    contingency,
    total,
    blendedRatePerSf: total / squareFeet,
    timeline: phases,
    weeks,
  }
}
