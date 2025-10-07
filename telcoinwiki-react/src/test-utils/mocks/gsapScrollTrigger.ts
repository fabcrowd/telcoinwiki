import { vi } from 'vitest'

export const ScrollTrigger = {
  update: vi.fn(),
  refresh: vi.fn(),
}

export function resetScrollTriggerMock() {
  ScrollTrigger.update.mockClear()
  ScrollTrigger.refresh.mockClear()
}

const exportedScrollTrigger = ScrollTrigger

export default exportedScrollTrigger
