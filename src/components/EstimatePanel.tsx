import { useCountUp } from '../hooks/useCountUp'
import { currency, integer, weeksLabel } from '../lib/format'
import type { Estimate } from '../lib/pricing'
import { ProgrammeStrip } from './ProgrammeStrip'

interface Props {
  estimate: Estimate
  revision: number
  client: string
  onClient: (value: string) => void
  onReset: () => void
}

const ISSUED = new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function revisionLabel(revision: number): string {
  if (revision === 0) return 'Rev —'
  return `Rev ${String.fromCharCode(65 + ((revision - 1) % 26))}`
}

export function EstimatePanel({ estimate, revision, client, onClient, onReset }: Props) {
  const total = useCountUp(estimate.total)
  const weeks = Math.round(useCountUp(estimate.weeks, 220))
  const rate = useCountUp(estimate.blendedRatePerSf, 220)

  return (
    <aside className="flex h-full flex-col border-t border-line-strong bg-concrete lg:border-l lg:border-t-0">
      {/* header band */}
      <div className="flex items-center justify-between bg-ink px-5 py-3 text-paper">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em]">Live Estimate</span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-paper/55">FO&#8209;01</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {/* headline */}
        <div className="border-b border-line-strong px-5 pb-2.5 pt-2.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-graphite">
            Indicative cost
          </div>
          <div className="u-expanded mt-1.5 text-[2.15rem] font-semibold leading-none tabular-nums text-ink">
            {currency(total)}
          </div>
          <div className="mt-1.5 h-0.5 w-14 bg-accent" />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Metric label="Programme">{weeksLabel(weeks)}</Metric>
            <Metric label="Blended rate">
              {currency(rate)}
              <span className="text-graphite"> / SF</span>
            </Metric>
          </div>

          <div className="mt-3">
            <ProgrammeStrip timeline={estimate.timeline} weeks={estimate.weeks} />
          </div>
        </div>

        {/* schedule of quantities */}
        <div className="px-5 py-2.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-graphite">
            Schedule of quantities
          </div>
          <dl className="mt-2 flex flex-col gap-[5px] text-[12px]">
            <Row label="Gross internal area" value={`${integer(estimate.squareFeet)} SF`} />
            {estimate.lineItems.map((item) => (
              <Row key={item.key} label={item.label} tier={item.tier} value={currency(item.amount)} />
            ))}

            <div className="my-1 border-t border-line-strong" />

            <Row label="Hard cost" value={currency(estimate.hardCost)} strong />
            <Row label="Professional fees" tier="12%" value={currency(estimate.professionalFees)} />
            <Row label="Contingency" tier="5%" value={currency(estimate.contingency)} />
          </dl>
        </div>

        {/* basis of estimate */}
        <div className="border-t border-line px-5 py-2.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-graphite">
            Basis of estimate
          </div>
          <ul className="mt-1.5 flex flex-col gap-[3px] font-mono text-[10px] leading-snug text-graphite">
            <li>Rates current Q3 2026 · CAT&#8209;B whole-floor</li>
            <li>{integer(estimate.workstations)} workstations at 1 per 160 SF</li>
            <li>Excludes landlord base-build works and tax</li>
          </ul>
        </div>

        {/* title-block footer */}
        <div className="mt-auto border-t border-line-strong px-5 py-3">
          <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-graphite">
            Prepared for
            <input
              type="text"
              value={client}
              onChange={(e) => onClient(e.target.value)}
              placeholder="Client name"
              className="mt-1.5 w-full border-b border-line-strong bg-transparent pb-1 font-sans text-[13px] normal-case tracking-normal text-ink placeholder:text-graphite/70 focus:border-accent focus:outline-none"
            />
          </label>

          <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-wide text-graphite">
            {revisionLabel(revision)} · Issued {ISSUED} · Ashworth Cole
            <br />
            Indicative estimate — not a formal quotation.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-3 rounded-md border border-line-strong px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-graphite transition-colors hover:border-accent hover:text-accent"
          >
            Reset specification
          </button>
        </div>
      </div>
    </aside>
  )
}

function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-graphite">{label}</div>
      <div className="mt-1 font-mono text-[15px] tabular-nums text-ink">{children}</div>
    </div>
  )
}

function Row({
  label,
  tier,
  value,
  strong,
}: {
  label: string
  tier?: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-baseline">
      <dt className={strong ? 'text-ink' : 'text-graphite'}>
        {label}
        {tier && <span className="text-ink"> — {tier}</span>}
      </dt>
      <span className="leader" />
      <dd className={`font-mono tabular-nums ${strong ? 'font-medium text-ink' : 'text-ink'}`}>
        {value}
      </dd>
    </div>
  )
}
