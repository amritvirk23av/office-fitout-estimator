import { currency } from '../lib/format'
import type { Config } from '../lib/pricing'

type CategoryKey = keyof Omit<Config, 'squareFeet'>

interface Option {
  id: string
  label: string
  note: string
}

interface Props {
  code: string
  label: string
  options: Option[]
  value: string
  amount: number
  onChange: (categoryKey: CategoryKey, value: string) => void
  categoryKey: CategoryKey
}

export function SystemSelector({ code, label, options, value, amount, onChange, categoryKey }: Props) {
  const selected = options.find((o) => o.id === value) ?? options[0]

  return (
    <div className="border-b border-line py-2 last:border-b-0">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <span className="font-mono text-[10px] tracking-widest text-accent">{code}</span>
          <span className="text-[13px] font-medium text-ink">{label}</span>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1">
          <div
            role="radiogroup"
            aria-label={label}
            className="inline-flex overflow-hidden rounded-md border border-line-strong"
          >
            {options.map((opt, i) => {
              const active = opt.id === value
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange(categoryKey, opt.id)}
                  className={[
                    'relative px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors',
                    i > 0 ? 'border-l border-line' : '',
                    active
                      ? 'bg-accent/10 text-accent'
                      : 'bg-transparent text-graphite hover:text-ink',
                  ].join(' ')}
                >
                  {opt.label}
                  {active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />}
                </button>
              )
            })}
          </div>
          <div className="w-[92px] text-right font-mono text-[13px] tabular-nums text-ink max-sm:w-auto">
            {currency(amount)}
          </div>
        </div>
      </div>

      <p className="mt-1 font-mono text-[11px] leading-relaxed text-graphite sm:pl-10">{selected.note}</p>
    </div>
  )
}
