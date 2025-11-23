/**
 * Calculates dynamic offsets for sticky cards (matches avax.network pattern)
 * 
 * Algorithm:
 * 1. For each card, measure distance from card top to reference element
 * 2. Set that offset on the NEXT card to create cascading stack effect
 * 3. Formula: (referenceTop - cardTop) + existingOffset
 * 
 * This creates a cascading stack where each card sticks at the right position
 * relative to the previous card's content.
 */

interface OffsetMeasurement {
  card: HTMLElement
  cardTop: number
  referenceTop: number
}

/**
 * Calculate offsets for sticky cards based on avax.network pattern
 * @param deck - The container element holding all cards
 * @param cardSelector - CSS selector for cards (default: '.sliding-stack__card')
 * @param referenceSelector - CSS selector for reference element within each card (default: '.sliding-stack__content')
 * @returns Map of card element to its calculated offset value
 */
export function calculateStickyOffsets(
  deck: HTMLElement,
  cardSelector: string = '.sliding-stack__card',
  referenceSelector: string = '.sliding-stack__content',
): Map<HTMLElement, number> {
  const cards = Array.from(deck.querySelectorAll<HTMLElement>(cardSelector))
  const offsets = new Map<HTMLElement, number>()

  if (cards.length === 0) {
    return offsets
  }

  // First card always starts with offset 0 (matches avax.network)
  offsets.set(cards[0], 0)
  cards[0].style.setProperty('--offset', '0px')

  // Batch getBoundingClientRect() calls for better performance
  // Calculate all positions first, then apply offsets
  const measurements: OffsetMeasurement[] = cards.map((card) => {
    const contentEl = card.querySelector<HTMLElement>(referenceSelector)
    const referenceEl = contentEl || card
    const cardRect = card.getBoundingClientRect()
    const referenceRect = referenceEl.getBoundingClientRect()
    return {
      card,
      cardTop: cardRect.top,
      referenceTop: referenceRect.top,
    }
  })

  // Calculate offset for each card based on previous card's content
  // Matches avax.network: (referenceTop - cardTop) + existingOffset
  measurements.forEach((measurement, index) => {
    const nextCard = cards[index + 1]
    if (!nextCard) return

    // Get current card's offset (starts at 0 for first card)
    const currentOffset = offsets.get(measurement.card) || 0

    // Calculate offset for next card (exact avax.network formula)
    // Formula: (referenceTop - cardTop) + existingOffset
    const nextOffset = (measurement.referenceTop - measurement.cardTop) + currentOffset

    // Store and apply offset to next card (not current - matches avax.network)
    offsets.set(nextCard, nextOffset)
    nextCard.style.setProperty('--offset', `${nextOffset}px`)
  })

  return offsets
}

