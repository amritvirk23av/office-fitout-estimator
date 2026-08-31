import type { TimelinePhase } from '../lib/pricing'

interface Props {
  timeline: TimelinePhase[]
  weeks: number
}

/** Compact programme phasing bar for the title block — segments sized by weeks, handover in accent. */
export function ProgrammeStrip({ timeline, weeks }: Props) {
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-[4px] border border-line-strong">
        {timeline.map((phase, i) => {
          const last = i === timeline.length - 1
          return (
            <div
              key={phase.key}
              className={[
                'h-full transition-[width] duration-200',
                i > 0 ? 'border-l border-paper/60' : '',
                last ? 'bg-accent' : 'bg-ink',
              ].join(' ')}
              style={{ width: `${(phase.weeks / weeks) * 100}%` }}
            />
          )
        })}
      </div>
      <ol className="mt-1.5 grid grid-cols-5 gap-x-1.5 font-mono text-[8.5px] uppercase leading-tight tracking-[0.03em] text-graphite">
        {timeline.map((phase, i) => {
          const last = i === timeline.length - 1
          return (
            <li key={phase.key} className="flex flex-col gap-0.5">
              <span className={`tabular-nums ${last ? 'text-accent' : 'text-ink'}`}>{phase.weeks}w</span>
              <span className="truncate">{phase.label}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
