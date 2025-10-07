export interface LenisOptions {
  smoothWheel?: boolean
  smoothTouch?: boolean
  [key: string]: unknown
}

export default class Lenis {
  constructor(options?: LenisOptions) {
    void options
  }

  raf(time: number) {
    void time
  }

  on(event: string, handler: () => void) {
    void event
    void handler
  }

  off(event: string, handler: () => void) {
    void event
    void handler
  }

  destroy() {}
}
