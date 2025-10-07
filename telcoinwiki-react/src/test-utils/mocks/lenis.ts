import { vi } from 'vitest'

export interface LenisOptions {
  smoothWheel?: boolean
  smoothTouch?: boolean
  [key: string]: unknown
}

export interface LenisMockInstance {
  raf: ReturnType<typeof vi.fn>
  on: ReturnType<typeof vi.fn>
  off: ReturnType<typeof vi.fn>
  destroy: ReturnType<typeof vi.fn>
}

export const lenisMockInstance: LenisMockInstance = {
  raf: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  destroy: vi.fn(),
}

const lenisConstructor = vi.fn(function LenisMock(this: unknown, options?: LenisOptions) {
  void this
  void options
  return lenisMockInstance
})

export type LenisConstructor = new (options?: LenisOptions) => LenisMockInstance

export const lenisConstructorMock = lenisConstructor

export function resetLenisMock() {
  lenisConstructor.mockClear()
  lenisMockInstance.raf.mockClear()
  lenisMockInstance.on.mockClear()
  lenisMockInstance.off.mockClear()
  lenisMockInstance.destroy.mockClear()
}

const exportedConstructor = lenisConstructor as unknown as LenisConstructor

export default exportedConstructor
