import { useRef, useState } from 'react'
import { AREA } from '../lib/pricing'
import { integer } from '../lib/format'
import { SectionLabel } from './SectionLabel'

interface Props {
  value: number
  workstations: number
  onChange: (squareFeet: number) => void
}

const { min, max, step } = AREA

/**
 * Core-dimensions control. The slider is rendered as an architectural
 * dimension line: extension lines, oblique end ticks, a thin travelling
 * marker and a measurement callout.
 */
export function DimensionControl({ value, workstations, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  const pct = ((value - min) / (max - min)) * 100

  // Keep the callout tethered to the marker without clipping at the ends.
  const calloutShift = pct < 12 ? '0%' : pct > 88 ? '-100%' : '-50%'

  function commitDraft(raw: string) {
    const parsed = Number.parseInt(raw.replace(/[^0-9]/g, ''), 10)
    const next = Number.isNaN(parsed)
      ? value
      : Math.min(max, Math.max(min, Math.round(parsed / step) * step))
    if (next !== value) onChange(next)
    // Normalise the field — reverts junk input and shows the grouped figure.
    if (inputRef.current) inputRef.current.value = integer(next)
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionLabel index="01" hint="Drives every line">
        Core dimensions
      </SectionLabel>

      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">
            Gross internal area
          </div>
          <div className="u-expanded mt-1 flex items-baseline gap-1.5 text-[2.35rem] font-semibold leading-none tabular-nums text-ink">
            {integer(value)}
            <span className="u-condensed text-sm font-medium tracking-widest text-graphite">SF</span>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-graphite">
          <span className="text-graphite/70">≈ </span>
          <span className="text-ink">{workstations}</span> workstations
        </div>
      </div>

      {/* Dimension line ------------------------------------------------ */}
      <div className="relative h-[52px] select-none">
        {/* callout */}
        <div
          className="pointer-events-none absolute top-0 z-20"
          style={{ left: `${pct}%`, transform: `translateX(${calloutShift})` }}
        >
          <div className="border border-ink bg-paper-raised px-2 py-0.5 font-mono text-[11px] tabular-nums text-ink">
            {integer(value)} SF
          </div>
        </div>

        {/* leader from callout to line */}
        <div
          className="pointer-events-none absolute top-[21px] z-10 w-px bg-ink/50"
          style={{ left: `${pct}%`, height: '15px' }}
        />

        {/* the dimension line + extension lines + end ticks */}
        <div className="absolute inset-x-0 top-[36px]">
          <div className="relative h-px bg-ink">
            {/* extension lines */}
            <span className="absolute -top-2 left-0 h-4 w-px bg-ink/60" />
            <span className="absolute -top-2 right-0 h-4 w-px bg-ink/60" />
            {/* oblique end ticks */}
            <span className="absolute left-0 top-1/2 h-3.5 w-px -translate-y-1/2 rotate-45 bg-ink" />
            <span className="absolute right-0 top-1/2 h-3.5 w-px -translate-y-1/2 rotate-45 bg-ink" />
            {/* measured span */}
            <span
              className="absolute top-0 left-0 h-px bg-accent transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
            {/* travelling marker */}
            <span
              className="absolute top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-accent transition-[left] duration-150"
              style={{ left: `${pct}%` }}
            />
            {focused && (
              <span
                className="absolute top-1/2 h-10 w-4 -translate-x-1/2 -translate-y-1/2 border border-accent transition-[left] duration-150"
                style={{ left: `${pct}%` }}
              />
            )}
          </div>
        </div>

        {/* end labels */}
        <div className="absolute inset-x-0 top-[42px] flex justify-between font-mono text-[10px] tabular-nums text-graphite">
          <span>{integer(min)}</span>
          <span>{integer(max)}</span>
        </div>

        {/* real control — invisible, on top, keyboard accessible */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Gross internal area, square feet"
          className="absolute inset-x-0 top-[24px] m-0 h-8 w-full cursor-ew-resize opacity-0"
        />
      </div>

      {/* precise entry ------------------------------------------------- */}
      <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-graphite">
        Enter area
        <span className="inline-flex items-baseline border-b border-line-strong focus-within:border-accent">
          <input
            key={value}
            ref={inputRef}
            type="text"
            inputMode="numeric"
            defaultValue={integer(value)}
            onBlur={(e) => commitDraft(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }}
            aria-label="Enter gross internal area in square feet"
            className="w-[8ch] bg-transparent py-1 text-right text-sm tracking-normal tabular-nums text-ink outline-none"
          />
          <span className="pl-1 text-graphite">SF</span>
        </span>
      </label>
    </section>
  )
}
