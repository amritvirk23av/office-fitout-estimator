const DATE = new Date()
  .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  .toUpperCase()

/** Drawing-sheet border strip along the foot of the configurator. */
export function SheetFooter() {
  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line-strong pt-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-graphite">
      <span className="text-ink">Sheet FO&#8209;01</span>
      <span className="text-accent">Indicative — not for construction</span>
      <span>{DATE}</span>
    </div>
  )
}
