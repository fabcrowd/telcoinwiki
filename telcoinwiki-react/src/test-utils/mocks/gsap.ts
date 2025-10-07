import { vi } from 'vitest'

interface TimelineInstance {
  to: ReturnType<typeof vi.fn>
  progress: ReturnType<typeof vi.fn>
  scrollTrigger: {
    kill: ReturnType<typeof vi.fn>
    isActive: boolean
    progress: number
    eventCallback: ReturnType<typeof vi.fn>
  }
  kill: ReturnType<typeof vi.fn>
}

const timelineInstances: TimelineInstance[] = []

const registerPluginMock = vi.fn()

const contextMock = vi.fn((fn: () => void) => {
  fn()
  return { revert: vi.fn() }
})

const createTimelineInstance = (): TimelineInstance => {
  const scrollTrigger = {
    kill: vi.fn(),
    isActive: false,
    progress: 0,
    eventCallback: vi.fn(),
  }

  return {
    to: vi.fn(),
    progress: vi.fn(() => 0),
    scrollTrigger,
    kill: vi.fn(),
  }
}

const timelineMock = vi.fn(() => {
  const instance = createTimelineInstance()
  timelineInstances.push(instance)
  return instance
})

export const gsapMock = {
  registerPlugin: registerPluginMock,
  context: contextMock,
  timeline: timelineMock,
  core: { Timeline: vi.fn() },
}

export type GsapTimelineMock = TimelineInstance

export function getGsapTimelines(): TimelineInstance[] {
  return [...timelineInstances]
}

export function resetGsapMock() {
  registerPluginMock.mockClear()
  contextMock.mockClear()
  timelineMock.mockClear()

  for (const instance of timelineInstances) {
    instance.to.mockClear()
    instance.progress.mockClear()
    instance.kill.mockClear()
    instance.scrollTrigger.kill.mockClear()
    instance.scrollTrigger.eventCallback.mockClear()
    instance.scrollTrigger.isActive = false
    instance.scrollTrigger.progress = 0
  }

  timelineInstances.length = 0
}

const exportedGsap = gsapMock

export default exportedGsap
