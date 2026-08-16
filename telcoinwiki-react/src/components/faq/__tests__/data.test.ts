import { faqItems, faqGroups, pickFaqItems } from '../data'

describe('faq catalogue', () => {
  it('has no duplicate questions', () => {
    const seen = new Set<string>()
    const duplicates: string[] = []

    faqItems.forEach((item) => {
      if (seen.has(item.question)) {
        duplicates.push(item.question)
      }
      seen.add(item.question)
    })

    expect(duplicates).toEqual([])
  })

  it('only groups items that exist in the catalogue', () => {
    const catalogue = new Set(faqItems)
    const strays = faqGroups
      .flatMap((group) => group.items)
      .filter((item) => !catalogue.has(item))
      .map((item) => item.question)

    expect(strays).toEqual([])
  })

  /**
   * This is the assertion that actually protects the page. `pickFaqItems`
   * drops unknown questions rather than throwing, so a typo in a group would
   * otherwise silently remove an answer from the site. Requiring every
   * catalogue entry to appear exactly once turns that into a failing test.
   */
  it('surfaces every catalogue item in exactly one group', () => {
    const counts = new Map<string, number>()
    faqItems.forEach((item) => counts.set(item.question, 0))

    faqGroups.forEach((group) => {
      group.items.forEach((item) => {
        counts.set(item.question, (counts.get(item.question) ?? 0) + 1)
      })
    })

    const orphaned = [...counts].filter(([, count]) => count === 0).map(([question]) => question)
    const duplicated = [...counts].filter(([, count]) => count > 1).map(([question]) => question)

    expect({ orphaned, duplicated }).toEqual({ orphaned: [], duplicated: [] })
  })

  it('gives every group a title and at least one item', () => {
    faqGroups.forEach((group) => {
      expect(group.title.trim()).not.toHaveLength(0)
      expect(group.items.length).toBeGreaterThan(0)
    })
  })
})

describe('pickFaqItems', () => {
  it('resolves questions in the order requested', () => {
    const [first, second] = pickFaqItems(['b', 'a'], [
      { question: 'a', answer: null },
      { question: 'b', answer: null },
    ])

    expect(first.question).toBe('b')
    expect(second.question).toBe('a')
  })

  it('drops unknown questions and reports them instead of throwing', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})

    const result = pickFaqItems(['a', 'nope'], [{ question: 'a', answer: null }])

    expect(result).toHaveLength(1)
    expect(error).toHaveBeenCalledWith(expect.stringContaining('nope'))

    error.mockRestore()
  })
})
