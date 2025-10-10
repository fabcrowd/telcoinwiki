export type FaqTag = {
  slug: string
  label: string
}

export type FaqSource = {
  label: string
  url: string
}

export type FaqEntry = {
  id: string
  question: string
  answerHtml: string
  displayOrder: number
  updatedAt: string | null
  tags: FaqTag[]
  sources: FaqSource[]
}

export type StatusMetric = {
  key: string
  label: string
  value: number
  unit: string | null
  notes: string | null
  updateStrategy: 'manual' | 'automated'
  updatedAt: string | null
}
