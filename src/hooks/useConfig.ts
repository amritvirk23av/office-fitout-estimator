import { useCallback, useEffect, useReducer } from 'react'
import {
  ACOUSTIC,
  AV,
  DEFAULT_CONFIG,
  FURNITURE,
  LIGHTING,
  type Config,
} from '../lib/pricing'

const STORAGE_KEY = 'ashworth-cole.fitout.v1'

interface State {
  config: Config
  /** Bumps on every specification change (not on area) — shown as the drawing revision. */
  revision: number
}

type Action =
  | { type: 'setArea'; squareFeet: number }
  | { type: 'setTier'; key: keyof Omit<Config, 'squareFeet'>; value: string }
  | { type: 'reset' }

const VALID: Record<keyof Omit<Config, 'squareFeet'>, readonly string[]> = {
  acoustic: ACOUSTIC.order,
  furniture: FURNITURE.order,
  av: AV.order,
  lighting: LIGHTING.order,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setArea':
      return { ...state, config: { ...state.config, squareFeet: action.squareFeet } }
    case 'setTier':
      if (!VALID[action.key].includes(action.value)) return state
      if (state.config[action.key] === action.value) return state
      return {
        config: { ...state.config, [action.key]: action.value },
        revision: state.revision + 1,
      }
    case 'reset':
      return { config: DEFAULT_CONFIG, revision: 0 }
    default:
      return state
  }
}

function isTier<T extends keyof Omit<Config, 'squareFeet'>>(key: T, value: unknown): value is Config[T] {
  return typeof value === 'string' && VALID[key].includes(value)
}

function load(): State {
  const fresh: State = { config: DEFAULT_CONFIG, revision: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fresh
    const parsed = JSON.parse(raw) as Partial<Config>
    const config: Config = {
      squareFeet:
        typeof parsed.squareFeet === 'number' && Number.isFinite(parsed.squareFeet)
          ? parsed.squareFeet
          : DEFAULT_CONFIG.squareFeet,
      acoustic: isTier('acoustic', parsed.acoustic) ? parsed.acoustic : DEFAULT_CONFIG.acoustic,
      furniture: isTier('furniture', parsed.furniture) ? parsed.furniture : DEFAULT_CONFIG.furniture,
      av: isTier('av', parsed.av) ? parsed.av : DEFAULT_CONFIG.av,
      lighting: isTier('lighting', parsed.lighting) ? parsed.lighting : DEFAULT_CONFIG.lighting,
    }
    return { config, revision: 0 }
  } catch {
    return fresh
  }
}

export function useConfig() {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config))
    } catch {
      /* private mode / storage disabled — the tool still works, it just won't remember. */
    }
  }, [state.config])

  const setArea = useCallback((squareFeet: number) => dispatch({ type: 'setArea', squareFeet }), [])
  const setTier = useCallback(
    (key: keyof Omit<Config, 'squareFeet'>, value: string) => dispatch({ type: 'setTier', key, value }),
    [],
  )
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  return { config: state.config, revision: state.revision, setArea, setTier, reset }
}
