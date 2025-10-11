export type Axis = 'y' | 'x'

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export const schedule = (() => {
  let raf = 0
  return (cb: () => void) => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      cb()
    })
  }
})()

export const getViewportSize = () => ({
  w: window.innerWidth || document.documentElement.clientWidth || 0,
  h: window.innerHeight || document.documentElement.clientHeight || 0,
})

