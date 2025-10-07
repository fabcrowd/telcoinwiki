import { vi } from 'vitest'

type MediaQueryListener = (event: MediaQueryListEvent) => void

interface MediaQueryControl {
  matchMedia: (query: string) => MediaQueryList
  setMatches: (query: string, matches: boolean) => void
  reset: () => void
}

export function createMediaQueryControl(): MediaQueryControl {
  const listeners = new Map<string, Set<MediaQueryListener>>()
  const instances = new Map<string, Set<MediaQueryList>>()
  const state = new Map<string, boolean>()

  const notify = (query: string, matches: boolean) => {
    const mqls = instances.get(query)
    const changeEvent = { matches, media: query } as MediaQueryListEvent

    if (mqls) {
      for (const mql of mqls) {
        ;(mql as unknown as { matches: boolean }).matches = matches

        if (typeof mql.onchange === 'function') {
          mql.onchange(changeEvent)
        }
      }
    }

    const registeredListeners = listeners.get(query)

    if (registeredListeners) {
      for (const listener of registeredListeners) {
        listener(changeEvent)
      }
    }
  }

  const matchMedia = vi.fn((query: string): MediaQueryList => {
    const initialMatches = state.get(query) ?? false
    const queryListeners = listeners.get(query) ?? new Set<MediaQueryListener>()
    listeners.set(query, queryListeners)

    const mql: MediaQueryList = {
      matches: initialMatches,
      media: query,
      onchange: null,
      addEventListener: (_event: string, listener: EventListenerOrEventListenerObject) => {
        if (typeof listener === 'function') {
          queryListeners.add(listener as MediaQueryListener)
        }
      },
      removeEventListener: (_event: string, listener: EventListenerOrEventListenerObject) => {
        if (typeof listener === 'function') {
          queryListeners.delete(listener as MediaQueryListener)
        }
      },
      addListener: (listener: MediaQueryListener) => {
        queryListeners.add(listener)
      },
      removeListener: (listener: MediaQueryListener) => {
        queryListeners.delete(listener)
      },
      dispatchEvent: () => false,
    }

    const instancesForQuery = instances.get(query) ?? new Set<MediaQueryList>()
    instancesForQuery.add(mql)
    instances.set(query, instancesForQuery)

    return mql
  })

  const setMatches = (query: string, matches: boolean) => {
    state.set(query, matches)
    notify(query, matches)
  }

  const reset = () => {
    listeners.clear()
    instances.clear()
    state.clear()
  }

  return { matchMedia, setMatches, reset }
}

const mediaQueryControl = createMediaQueryControl()

export const matchMediaMock = mediaQueryControl.matchMedia
export const setMatchMedia = mediaQueryControl.setMatches
export const resetMatchMedia = mediaQueryControl.reset
