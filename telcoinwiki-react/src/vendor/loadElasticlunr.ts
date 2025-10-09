const ensureGlobalLunrBinding = (): void => {
  if (typeof globalThis === 'undefined') {
    return
  }

  new Function('if(typeof lunr==="undefined"){lunr=undefined;}')()
}

export interface ElasticlunrIndex<TDoc extends object = Record<string, unknown>> {
  setRef(fieldName: string): void
  addField(fieldName: string): void
  addDoc(doc: TDoc): void
  search(
    query: string,
    options?: {
      expand?: boolean
      bool?: 'AND' | 'OR'
      fields?: Record<string, { boost?: number }>
    },
  ): Array<{ ref: string; score: number }>
}

export type ElasticlunrFactory = <TDoc extends object = Record<string, unknown>>() => ElasticlunrIndex<TDoc>

interface ElasticlunrModule {
  default: ElasticlunrFactory
}

declare global {
  // eslint-disable-next-line no-var
  var lunr: ElasticlunrFactory | undefined
}

let cachedModule: ElasticlunrModule | null = null

export const loadElasticlunr = async (): Promise<ElasticlunrModule> => {
  ensureGlobalLunrBinding()

  if (cachedModule) {
    globalThis.lunr = cachedModule.default
    return cachedModule
  }

  const module = (await import('elasticlunr')) as unknown as ElasticlunrModule
  cachedModule = module
  globalThis.lunr = module.default
  return module
}
