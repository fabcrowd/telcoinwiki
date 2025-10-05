import type { FaqEntry } from '../lib/queries'

export interface ArtifactFaqEntry {
  id: string
  question: string
  answer: string
  tags?: string[]
  sources?: { label: string; url: string }[]
}

export const slugifyTag = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const mapArtifactFaqEntries = (entries: ArtifactFaqEntry[]): FaqEntry[] =>
  entries.map((entry, index) => ({
    id: entry.id,
    question: entry.question,
    answerHtml: entry.answer,
    displayOrder: index + 1,
    updatedAt: null,
    tags: (entry.tags ?? []).map((label) => ({ label, slug: slugifyTag(label) })),
    sources: (entry.sources ?? []).map((source) => ({ label: source.label, url: source.url })),
  }))
