export interface LenisOptions {
  smoothWheel?: boolean
  smoothTouch?: boolean
  [key: string]: unknown
}

export default class Lenis {
  constructor(_options?: LenisOptions) {}

  raf(_time: number) {}

  on(_event: string, _handler: () => void) {}

  off(_event: string, _handler: () => void) {}

  destroy() {}
}
