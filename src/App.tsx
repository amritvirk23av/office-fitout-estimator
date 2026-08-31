import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { DimensionControl } from './components/DimensionControl'
import { SectionLabel } from './components/SectionLabel'
import { SystemSelector } from './components/SystemSelector'
import { SheetFooter } from './components/SheetFooter'
import { EstimatePanel } from './components/EstimatePanel'
import { useConfig } from './hooks/useConfig'
import { UI_CATEGORIES, calculateEstimate } from './lib/pricing'

const CLIENT_KEY = 'ashworth-cole.fitout.client'

export default function App() {
  const { config, revision, setArea, setTier, reset } = useConfig()
  const estimate = useMemo(() => calculateEstimate(config), [config])

  const [client, setClient] = useState(() => {
    try {
      return localStorage.getItem(CLIENT_KEY) ?? ''
    } catch {
      return ''
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(CLIENT_KEY, client)
    } catch {
      /* storage unavailable — no-op */
    }
  }, [client])

  return (
    <div className="flex min-h-full flex-col overflow-y-auto bg-paper lg:items-center lg:justify-center lg:p-5 xl:p-7">
      <div className="flex w-full max-w-[1480px] flex-1 flex-col border-line-strong lg:h-[calc(100dvh-2.5rem)] lg:max-h-[760px] lg:flex-none lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-1 lg:overflow-hidden lg:border xl:max-h-[820px] xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="drafting-grid flex min-h-0 flex-col gap-5 px-5 py-5 lg:overflow-y-auto xl:gap-6 xl:px-8 xl:py-7">
          <Header />

          <DimensionControl
            value={config.squareFeet}
            workstations={estimate.workstations}
            onChange={setArea}
          />

          <section className="flex flex-col gap-2">
            <SectionLabel index="02" hint="Toggle specification">
              Material &amp; system tiers
            </SectionLabel>
            <div>
              {UI_CATEGORIES.map((category) => (
                <SystemSelector
                  key={category.key}
                  code={category.code}
                  label={category.label}
                  categoryKey={category.key}
                  options={category.options}
                  value={config[category.key]}
                  amount={estimate.lineItems.find((l) => l.key === category.key)?.amount ?? 0}
                  onChange={setTier}
                />
              ))}
            </div>
          </section>

          <SheetFooter />
        </div>

        <EstimatePanel
          estimate={estimate}
          revision={revision}
          client={client}
          onClient={setClient}
          onReset={reset}
        />
      </div>
    </div>
  )
}
