const ensureGlobalLunrBinding = (): void => {
  if (typeof globalThis === 'undefined') {
    return
  }

  new Function('if(typeof lunr==="undefined"){lunr=undefined;}')()
}

type ElasticlunrModule = typeof import('elasticlunr')

declare global {
  interface GlobalThis {
    lunr?: ElasticlunrModule['default']
  }
}

let cachedModule: ElasticlunrModule | null = null

export const loadElasticlunr = async (): Promise<ElasticlunrModule> => {
  ensureGlobalLunrBinding()

  if (cachedModule) {
    globalThis.lunr = cachedModule.default
    return cachedModule
  }

  const module = (await import('elasticlunr')) as ElasticlunrModule
  cachedModule = module
  globalThis.lunr = module.default
  return module
}
