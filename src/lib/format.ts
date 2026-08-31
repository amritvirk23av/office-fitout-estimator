const usd0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const num0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

/** Precise currency, no cents — "$3,943,485". Used for the schedule of quantities. */
export function currency(value: number): string {
  return usd0.format(Math.round(value))
}

/** Plain grouped integer — "12,000". */
export function integer(value: number): string {
  return num0.format(Math.round(value))
}

/** Compact headline currency — "$3.94M" / "$940K". */
export function currencyCompact(value: number): string {
  const rounded = Math.round(value)
  if (rounded >= 1_000_000) {
    return `$${(rounded / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`
  }
  if (rounded >= 1_000) {
    return `$${Math.round(rounded / 1_000)}K`
  }
  return `$${rounded}`
}

export function weeksLabel(weeks: number): string {
  return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`
}
