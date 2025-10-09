import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import { cn } from '../../utils/cn'
import { ColorMorphCard } from './ColorMorphCard'

interface MainWorkspaceCardProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode
  /** Stage progress (0..1) to drive subtle color morphing */
  progress: number
}

/**
 * A full-bleed, viewport-filling card that "feels" like moving to a new workspace.
 * The scale and presence are controlled via the `--workspace-center` CSS var,
 * which is provided inline by StickyModule.stickyStyle (computed in useHomeScrollSections).
 */
export const MainWorkspaceCard = forwardRef<HTMLDivElement, MainWorkspaceCardProps>(function MainWorkspaceCard(
  { className, progress, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn('workspace-card', className)} {...rest}>
      <ColorMorphCard
        as="div"
        progress={progress}
        className={cn(
          'workspace-card__inner p-6 sm:p-8',
          // Visual polish: keep text readable while scaling
          'backdrop-blur-[0.5px]'
        )}
      >
        {children}
      </ColorMorphCard>
    </div>
  )
})

