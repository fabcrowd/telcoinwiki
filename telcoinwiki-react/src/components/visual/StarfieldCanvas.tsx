import { useEffect, useRef } from 'react'
import './StarfieldCanvas.css'

const STAR_COUNT = 500
const ROTATION_SPEED = 0.0005
const SHOOTING_STAR_MIN_INTERVAL = 60
const SHOOTING_STAR_MAX_INTERVAL = 180

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  life: number
  maxLife: number
  direction: number
}

interface Star {
  r: number
  theta: number
  size: number
  baseAlpha: number
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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

    const motionMediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let prefersReducedMotion = motionMediaQuery?.matches ?? false

    const getNextShootingStarInterval = () =>
      Math.floor(
        SHOOTING_STAR_MIN_INTERVAL + Math.random() * (SHOOTING_STAR_MAX_INTERVAL - SHOOTING_STAR_MIN_INTERVAL),
      )

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
      shootingStars = []
      framesUntilNextShootingStar = getNextShootingStarInterval()
    }

    const spawnShootingStar = () => {
      const spawnRadius = Math.sqrt(Math.random()) * maxRadius * 0.8
      const spawnTheta = Math.random() * Math.PI * 2
      const direction = Math.random() * Math.PI * 2
      const speed = 5 + Math.random() * 10
      const length = 20 + Math.random() * 30
      const lifetime = 20 + Math.random() * 20

      shootingStars.push({
        x: spawnRadius * Math.cos(spawnTheta),
        y: spawnRadius * Math.sin(spawnTheta),
        vx: Math.cos(direction) * speed,
        vy: Math.sin(direction) * speed,
        length,
        life: lifetime,
        maxLife: lifetime,
        direction,
      })
    }

    const updateShootingStars = () => {
      if (framesUntilNextShootingStar <= 0) {
        spawnShootingStar()
        framesUntilNextShootingStar = getNextShootingStarInterval()
      } else {
        framesUntilNextShootingStar -= 1
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

      if (!prefersReducedMotion) {
        for (const shootingStar of shootingStars) {
          const tailX = shootingStar.x - Math.cos(shootingStar.direction) * shootingStar.length
          const tailY = shootingStar.y - Math.sin(shootingStar.direction) * shootingStar.length
          const gradient = context.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y)
          const intensity = Math.max(shootingStar.life / shootingStar.maxLife, 0)
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
          gradient.addColorStop(1, `rgba(255, 255, 255, ${intensity})`)

          context.beginPath()
          context.moveTo(tailX, tailY)
          context.lineTo(shootingStar.x, shootingStar.y)
          context.strokeStyle = gradient
          context.lineWidth = 1
          context.stroke()
        }
      }

      context.restore()
    }

    const animate = () => {
      if (prefersReducedMotion) {
        animationId = null
        return
      }

      updateShootingStars()
      renderFrame()
      angle = (angle + ROTATION_SPEED) % (Math.PI * 2)
      animationId = window.requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (prefersReducedMotion || animationId !== null) {
        return
      }
      framesUntilNextShootingStar = getNextShootingStarInterval()
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

      canvas.width = viewportWidth * devicePixelRatio
      canvas.height = viewportHeight * devicePixelRatio
      canvas.style.width = `${viewportWidth}px`
      canvas.style.height = `${viewportHeight}px`

      generateStars()
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
        startAnimation()
      }
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
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden="true" />
}
