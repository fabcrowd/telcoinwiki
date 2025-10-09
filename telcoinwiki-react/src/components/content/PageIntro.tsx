import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import { cn } from '../../utils/cn'

type PageIntroVariant = 'card' | 'hero'

type SectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'title'>

interface PageIntroProps extends SectionProps {
  id?: string
  eyebrow: ReactNode
  title: ReactNode
  lede: ReactNode
  children?: ReactNode
  variant?: PageIntroVariant
  contentClassName?: string
  overlay?: ReactNode
  topRight?: ReactNode
}

export const PageIntro = forwardRef<HTMLElement, PageIntroProps>(function PageIntro(
  {
    id,
    eyebrow,
    title,
    lede,
    children,
    variant = 'card',
    className,
    contentClassName,
    overlay,
    topRight,
    ...rest
  },
  ref,
) {
  const variantClassName = variant === 'hero' ? 'glass-hero' : 'tc-card'

  return (
    <section
      id={id}
      ref={ref}
      className={cn('page-intro anchor-offset relative overflow-hidden', variantClassName, className)}
      {...rest}
    >
      {overlay ? <div className="pointer-events-none absolute inset-0" aria-hidden>{overlay}</div> : null}
      <div className={cn('relative z-10 flex flex-col gap-6', variant === 'hero' ? 'p-8 sm:p-10 lg:p-12' : 'p-6 sm:p-8', contentClassName)}>
        <div className={cn('flex flex-col gap-4', variant === 'hero' ? 'max-w-3xl' : undefined)}>
          <p
            className={cn(
              'page-intro__eyebrow',
              variant === 'hero' ? 'flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-telcoin-ink-subtle' : undefined,
            )}
          >
            {eyebrow}
          </p>
          <div className="flex flex-col gap-4">
            <h1
              className={cn(
                'page-intro__title',
                variant === 'hero' ? 'text-balance text-3xl font-semibold leading-tight text-telcoin-ink sm:text-4xl lg:text-5xl' : undefined,
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                'page-intro__lede',
                variant === 'hero' ? 'text-lg leading-relaxed text-telcoin-ink-muted sm:text-xl' : undefined,
              )}
            >
              {lede}
            </p>
          </div>
        </div>

        {children}
      </div>
      {topRight ? (
        <div className="pointer-events-none absolute right-6 top-6 hidden lg:block">
          {topRight}
        </div>
      ) : null}
    </section>
  )
})
