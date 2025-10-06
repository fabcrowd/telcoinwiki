import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const phrases = ['Community Q&A', 'Guides', 'Links']

const longestPhrase = phrases.reduce((currentLongest, phrase) => {
  return phrase.length > currentLongest.length ? phrase : currentLongest
}, phrases[0])

const longestPhraseLength = longestPhrase.length

const typingVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

export function HeroTypingLoop() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length)
    }, 2600)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-2 text-base font-semibold text-telcoin-ink">
      <span className="text-telcoin-ink-subtle">Community Q&amp;A →</span>
      <div
        className="relative shrink-0 overflow-hidden"
        style={{ minWidth: `${longestPhraseLength}ch` }}
      >
        <span
          aria-hidden="true"
          className="invisible flex items-center text-base font-semibold text-telcoin-accent"
        >
          {longestPhrase}
        </span>
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={phrases[index]}
            variants={typingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center text-base font-semibold text-telcoin-accent"
          >
            {phrases[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
