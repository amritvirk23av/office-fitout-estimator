const TODAY = new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function Header() {
  return (
    <header className="flex flex-col gap-2 border-b border-line-strong pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div>
        <div className="u-expanded text-lg font-semibold uppercase leading-none tracking-[0.14em] text-ink">
          Ashworth&nbsp;Cole
        </div>
        <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-graphite">
          Commercial Interiors · Est. 1994
        </div>
      </div>
      <div className="sm:text-right">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-graphite">
          Office Fit-Out Estimator
        </div>
        <div className="mt-1 font-mono text-[11px] tracking-wide text-graphite/80">{TODAY}</div>
      </div>
    </header>
  )
}
