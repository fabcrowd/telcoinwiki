import { useEffect, useRef, useState } from 'react'
import './StarfieldCanvas.css'

const STAR_COUNT = 500
const BASE_ROTATION_SPEED = 0.0005
const DESKTOP_ROTATION_MULTIPLIER = 0.5
const SHOOTING_STAR_MIN_DELAY = 60 // ~1 second at 60fps
const SHOOTING_STAR_MAX_DELAY = 240 // ~4 seconds at 60fps
const SHOOTING_STAR_MIN_SPEED = 6
const SHOOTING_STAR_MAX_SPEED = 18
const SHOOTING_STAR_MIN_LENGTH = 40
const SHOOTING_STAR_MAX_LENGTH = 80
const SHOOTING_STAR_MIN_LIFE = 30
const SHOOTING_STAR_MAX_LIFE = 60

interface Star {
  r: number
  theta: number
  size: number
  baseAlpha: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  direction: number
  life: number
  initialLife: number
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const hasActivatedVisibility = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    let animationId: number | null = null
    let viewportWidth = window.innerWidth
    let viewportHeight = window.innerHeight
    let devicePixelRatio = window.devicePixelRatio || 1
    let stars: Star[] = []
    let shootingStars: ShootingStar[] = []
    let angle = 0
    let maxRadius = 0
    let framesUntilNextShootingStar = 0
    let rotationMultiplier = 1

    const motionMediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let prefersReducedMotion = motionMediaQuery?.matches ?? false

    const desktopMediaQuery = window.matchMedia?.('(min-width: 1024px)')
    rotationMultiplier = desktopMediaQuery?.matches ? DESKTOP_ROTATION_MULTIPLIER : 1

    const generateStars = () => {
      maxRadius = Math.sqrt(viewportWidth * viewportWidth + viewportHeight * viewportHeight) / 2
      stars = Array.from({ length: STAR_COUNT }, () => {
        const radius = Math.sqrt(Math.random()) * maxRadius
        return {
          r: radius,
          theta: Math.random() * Math.PI * 2,
          size: Math.random() * 1.5 + 0.5,
          baseAlpha: Math.random() * 0.5 + 0.4,
        }
      })
    }

    const getNextShootingStarDelay = () =>
      SHOOTING_STAR_MIN_DELAY + Math.random() * (SHOOTING_STAR_MAX_DELAY - SHOOTING_STAR_MIN_DELAY)

    const spawnShootingStar = () => {
      const spawnRadius = Math.sqrt(Math.random()) * maxRadius * 0.8
      const theta = Math.random() * Math.PI * 2
      const direction = Math.random() * Math.PI * 2
      const speed = SHOOTING_STAR_MIN_SPEED + Math.random() * (SHOOTING_STAR_MAX_SPEED - SHOOTING_STAR_MIN_SPEED)
      const length = SHOOTING_STAR_MIN_LENGTH + Math.random() * (SHOOTING_STAR_MAX_LENGTH - SHOOTING_STAR_MIN_LENGTH)
      const life = SHOOTING_STAR_MIN_LIFE + Math.random() * (SHOOTING_STAR_MAX_LIFE - SHOOTING_STAR_MIN_LIFE)

      shootingStars.push({
        x: spawnRadius * Math.cos(theta),
        y: spawnRadius * Math.sin(theta),
        vx: Math.cos(direction) * speed,
        vy: Math.sin(direction) * speed,
        length,
        direction,
        life,
        initialLife: life,
      })
    }

    const updateShootingStars = () => {
      if (prefersReducedMotion) {
        shootingStars = []
        framesUntilNextShootingStar = 0
        return
      }

      framesUntilNextShootingStar -= 1

      if (framesUntilNextShootingStar <= 0) {
        spawnShootingStar()
        framesUntilNextShootingStar = getNextShootingStarDelay()
      }

      shootingStars = shootingStars
        .map((star) => ({
          ...star,
          x: star.x + star.vx,
          y: star.y + star.vy,
          life: star.life - 1,
        }))
        .filter((star) => star.life > 0)
    }

    const drawShootingStars = () => {
      for (const star of shootingStars) {
        const tailX = star.x - star.length * Math.cos(star.direction)
        const tailY = star.y - star.length * Math.sin(star.direction)
        const gradient = context.createLinearGradient(tailX, tailY, star.x, star.y)

        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
        gradient.addColorStop(1, `rgba(255, 255, 255, ${(star.life / star.initialLife) * 0.4})`)

        context.save()
        context.beginPath()
        context.moveTo(tailX, tailY)
        context.lineTo(star.x, star.y)
        context.strokeStyle = gradient
        context.lineWidth = 1
        context.lineCap = 'round'
        context.shadowBlur = 4
        context.shadowColor = 'rgba(255, 255, 255, 0.4)'
        context.stroke()
        context.restore()
      }
    }

    const renderFrame = () => {
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      context.clearRect(0, 0, viewportWidth, viewportHeight)
      context.save()
      context.translate(viewportWidth / 2, viewportHeight / 2)

      if (!prefersReducedMotion) {
        context.rotate(angle)
      }

      for (const star of stars) {
        const x = star.r * Math.cos(star.theta)
        const y = star.r * Math.sin(star.theta)
        const twinkle = prefersReducedMotion
          ? star.baseAlpha
          : Math.max(0.3, Math.min(1, star.baseAlpha + (Math.random() * 0.4 - 0.2)))

        context.beginPath()
        context.arc(x, y, star.size, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 255, 255, ${twinkle})`
        context.fill()
      }

      drawShootingStars()

      context.restore()
    }

    const animate = () => {
      updateShootingStars()
      renderFrame()
      angle = (angle + BASE_ROTATION_SPEED * rotationMultiplier) % (Math.PI * 2)
      animationId = window.requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (prefersReducedMotion || animationId !== null) {
        return
      }
      animationId = window.requestAnimationFrame(animate)
    }

    const stopAnimation = () => {
      if (animationId !== null) {
        window.cancelAnimationFrame(animationId)
        animationId = null
      }
    }

    const resizeCanvas = () => {
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      devicePixelRatio = window.devicePixelRatio || 1
      rotationMultiplier = desktopMediaQuery?.matches ? DESKTOP_ROTATION_MULTIPLIER : 1

      canvas.width = viewportWidth * devicePixelRatio
      canvas.height = viewportHeight * devicePixelRatio
      canvas.style.width = `${viewportWidth}px`
      canvas.style.height = `${viewportHeight}px`

      generateStars()
      shootingStars = []
      framesUntilNextShootingStar = getNextShootingStarDelay()
      renderFrame()
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches

      if (prefersReducedMotion) {
        stopAnimation()
        angle = 0
        shootingStars = []
        renderFrame()
      } else {
        framesUntilNextShootingStar = getNextShootingStarDelay()
        startAnimation()
      }
    }

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      rotationMultiplier = event.matches ? DESKTOP_ROTATION_MULTIPLIER : 1
    }

    resizeCanvas()

    if (prefersReducedMotion) {
      renderFrame()
    } else {
      startAnimation()
    }

    window.addEventListener('resize', resizeCanvas)

    if (motionMediaQuery) {
      if (typeof motionMediaQuery.addEventListener === 'function') {
        motionMediaQuery.addEventListener('change', handleMotionChange)
      } else if (typeof motionMediaQuery.addListener === 'function') {
        motionMediaQuery.addListener(handleMotionChange)
      }
    }

    if (desktopMediaQuery) {
      if (typeof desktopMediaQuery.addEventListener === 'function') {
        desktopMediaQuery.addEventListener('change', handleDesktopChange)
      } else if (typeof desktopMediaQuery.addListener === 'function') {
        desktopMediaQuery.addListener(handleDesktopChange)
      }
    }

    return () => {
      stopAnimation()
      window.removeEventListener('resize', resizeCanvas)

      if (motionMediaQuery) {
        if (typeof motionMediaQuery.removeEventListener === 'function') {
          motionMediaQuery.removeEventListener('change', handleMotionChange)
        } else if (typeof motionMediaQuery.removeListener === 'function') {
          motionMediaQuery.removeListener(handleMotionChange)
        }
      }

      if (desktopMediaQuery) {
        if (typeof desktopMediaQuery.removeEventListener === 'function') {
          desktopMediaQuery.removeEventListener('change', handleDesktopChange)
        } else if (typeof desktopMediaQuery.removeListener === 'function') {
          desktopMediaQuery.removeListener(handleDesktopChange)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const activateVisibility = () => {
      if (hasActivatedVisibility.current) {
        return
      }

      hasActivatedVisibility.current = true
      setIsVisible(true)
      window.removeEventListener('scroll', activateVisibility)
    }

    if (window.scrollY > 0) {
      activateVisibility()
    } else {
      window.addEventListener('scroll', activateVisibility, { passive: true })
    }

    return () => {
      window.removeEventListener('scroll', activateVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`starfield-canvas${isVisible ? ' starfield-canvas--visible' : ''}`}
      aria-hidden="true"
    />
  )
}
