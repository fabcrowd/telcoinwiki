import { useEffect, useRef } from 'react';
import { addScrollImpulse, createStar, decayVelocity, Star, updateStar } from '../utils/starfield';

const STAR_COUNT = 240;
const RESIZE_DEBOUNCE = 120;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let deviceRatio = window.devicePixelRatio || 1;
    let stars: Star[] = [];
    let animationFrame: number | null = null;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let resizeTimeout: number | null = null;
    const reduced = prefersReducedMotion();

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      deviceRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * deviceRatio);
      canvas.height = Math.floor(height * deviceRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
    };

    const drawStar = (star: Star) => {
      context.beginPath();
      const radius = 0.6 + star.depth * 1.4;
      context.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      context.arc(star.x, star.y, radius, 0, Math.PI * 2);
      context.fill();
    };

    const initializeStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => createStar(width, height));
    };

    const renderFrame = () => {
      context.clearRect(0, 0, width, height);
      for (let index = 0; index < stars.length; index += 1) {
        const updated = updateStar(stars[index]!, scrollVelocity, width, height);
        stars[index] = updated;
        drawStar(updated);
      }
      scrollVelocity = decayVelocity(scrollVelocity);
      animationFrame = requestAnimationFrame(renderFrame);
    };

    const renderStatic = () => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        drawStar(star);
      }
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY;
      lastScrollY = currentScroll;
      scrollVelocity = addScrollImpulse(scrollVelocity, delta);
    };

    const handleResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(() => {
        const previous = [...stars];
        setCanvasSize();
        initializeStars();
        if (!reduced) {
          stars = stars.map((star, index) => ({
            ...star,
            x: previous[index % previous.length]?.x ?? star.x,
            y: previous[index % previous.length]?.y ?? star.y
          }));
        }
        if (reduced) {
          renderStatic();
        }
      }, RESIZE_DEBOUNCE);
    };

    setCanvasSize();
    initializeStars();
    if (reduced) {
      renderStatic();
    } else {
      animationFrame = requestAnimationFrame(renderFrame);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full select-none"
      aria-hidden="true"
    />
  );
};

export default StarfieldBackground;
