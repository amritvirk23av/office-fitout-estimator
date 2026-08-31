interface Props {
  index?: string
  children: React.ReactNode
  hint?: string
}

/** Shared step / section eyebrow — mono, tracked, with an optional index marker. */
export function SectionLabel({ index, children, hint }: Props) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-1.5">
      <h2 className="flex items-baseline gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-ink">
        {index && <span className="text-brass">{index}</span>}
        {children}
      </h2>
      {hint && (
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-graphite sm:inline">
          {hint}
        </span>
      )}
    </div>
  )
}
