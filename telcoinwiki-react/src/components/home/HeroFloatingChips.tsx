import { useEffect, useState } from 'react'

const chips = [
  {
    id: 'liquidity',
    label: 'TELx liquidity',
    accent: 'from-telcoin-royalTone-soft to-transparent',
    border: 'border-telcoin-royalTone-outline',
    top: '22%',
    left: '68%',
    multiplier: -0.5,
  },
  {
    id: 'remittance',
    label: 'Remittance corridors',
    accent: 'from-telcoin-accent-soft via-transparent to-transparent',
    border: 'border-telcoin-border',
    top: '64%',
    left: '18%',
    multiplier: 0.7,
  },
]

export function HeroFloatingChips() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12
      const y = (event.clientY / window.innerHeight - 0.5) * 12
      setOffset({ x, y })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {chips.map((chip) => (
        <div
          key={chip.id}
          style={{
            top: chip.top,
            left: chip.left,
            transform: `translate3d(${offset.x * chip.multiplier}px, ${offset.y * chip.multiplier}px, 0)`,
          }}
          className={`hero-floating-chip absolute hidden rounded-full border ${chip.border} bg-gradient-to-br ${chip.accent} px-4 py-2 text-sm font-medium text-telcoin-ink shadow-lg lg:inline-flex`}
        >
          {chip.label}
        </div>
      ))}
    </div>
  )
}
