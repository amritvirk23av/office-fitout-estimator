import { useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Eases a displayed number toward `target` over `duration` ms.
 * Interruptible — a new target retargets from the current displayed value.
 * A safety timeout guarantees the final value even if rAF is throttled
 * (background tab) or the tab is hidden mid-animation.
 */
export function useCountUp(target: number, duration = 260): number {
  const [display, setDisplay] = useState(target)

  useEffect(() => {
    const snap = () => setDisplay((prev) => (prev === target ? prev : target))

    if (prefersReducedMotion() || document.hidden) {
      snap()
      return
    }

    let from: number | null = null
    let start = 0
    let raf = 0

    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay((prev) => {
        if (from === null) from = prev
        return from + (target - from) * eased
      })
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    const safety = window.setTimeout(snap, duration + 120)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(safety)
    }
  }, [target, duration])

  return display
}
