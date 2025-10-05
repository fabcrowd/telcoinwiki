declare module 'elasticlunr' {
  export interface ElasticSearchResult {
    ref: string
    score: number
  }

  export interface ElasticSearchOptions {
    expand?: boolean
  }

  export interface Index<T = Record<string, unknown>> {
    setRef(field: string): void
    addField(field: string): void
    addDoc(doc: T): void
    search(query: string, options?: ElasticSearchOptions): ElasticSearchResult[]
  }

  export type ElasticIndex<T = Record<string, unknown>> = Index<T>

  const elasticlunr: <T = Record<string, unknown>>(
    config?: (this: ElasticIndex<T>) => void,
  ) => ElasticIndex<T>

  export default elasticlunr
  export { ElasticIndex as Index }
}
