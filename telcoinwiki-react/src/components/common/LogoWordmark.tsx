import { forwardRef, useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

export type LogoWordmarkProps = ComponentPropsWithoutRef<'svg'> & {
  title?: string
  desc?: string
}

export const LogoWordmark = forwardRef<SVGSVGElement, LogoWordmarkProps>(function LogoWordmark(
  { className, title = 'Telcoin Wiki logo', desc = 'Wordmark showing the Telcoin name in white with Wiki in a bright Telx blue and a swoosh underline.', ...rest },
  ref,
) {
  const generatedTitleId = useId()
  const generatedDescId = useId()
  const titleId = rest['aria-labelledby'] ? undefined : `${generatedTitleId}-logoTitle`
  const descId = rest['aria-describedby'] ? undefined : `${generatedDescId}-logoDesc`

  return (
    <svg
      ref={ref}
      className={className}
      width={rest.width ?? 260}
      height={rest.height ?? 72}
      viewBox="0 0 260 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={rest['aria-labelledby'] ?? titleId}
      aria-describedby={rest['aria-describedby'] ?? descId}
      shapeRendering="geometricPrecision"
      {...rest}
    >
      {!rest['aria-labelledby'] && <title id={titleId}>{title}</title>}
      {!rest['aria-describedby'] && <desc id={descId}>{desc}</desc>}
      <defs>
        <linearGradient id="wikiGradient" x1="188" y1="10" x2="188" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2DC9FF" />
          <stop offset="1" stopColor="#0F6BFF" />
        </linearGradient>
        <linearGradient id="underlineGradient" x1="150" y1="60" x2="236" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2DC9FF" />
          <stop offset="1" stopColor="#0F6BFF" />
        </linearGradient>
      </defs>
      <path
        d="M1.349 23.181L9.81 23.181V46H15.586V23.181H24.047V18.364H1.349ZM34.684 46.405C39.811 46.405 43.266 43.908 44.076 40.063L38.759 39.712C38.179 41.29 36.694 42.114 34.778 42.114C31.904 42.114 30.082 40.211 30.082 37.121V37.107H44.197V35.528C44.197 28.484 39.933 25.003 34.454 25.003C28.355 25.003 24.401 29.335 24.401 35.731C24.401 42.303 28.301 46.405 34.684 46.405ZM30.082 33.545C30.204 31.183 31.998 29.294 34.549 29.294C37.045 29.294 38.772 31.075 38.786 33.545ZM54.267 18.364H48.519V46H54.267ZM68.79 46.405C74.309 46.405 77.777 43.166 78.047 38.403H72.623C72.285 40.616 70.828 41.857 68.858 41.857C66.172 41.857 64.432 39.604 64.432 35.636C64.432 31.723 66.186 29.483 68.858 29.483C70.963 29.483 72.312 30.873 72.623 32.938H78.047C77.804 28.147 74.174 25.003 68.763 25.003C62.475 25.003 58.589 29.362 58.589 35.717C58.589 42.019 62.407 46.405 68.79 46.405ZM91.68 46.405C97.968 46.405 101.882 42.1 101.882 35.717C101.882 29.294 97.968 25.003 91.68 25.003C85.392 25.003 81.478 29.294 81.478 35.717C81.478 42.1 85.392 46.405 91.68 46.405ZM91.707 41.952C88.806 41.952 87.321 39.293 87.321 35.677C87.321 32.06 88.806 29.388 91.707 29.388C94.554 29.388 96.039 32.06 96.039 35.677C96.039 39.293 94.554 41.952 91.707 41.952ZM106.203 46H111.952V25.273H106.203ZM109.091 22.601C110.805 22.601 112.208 21.292 112.208 19.686C112.208 18.094 110.805 16.785 109.091 16.785C107.39 16.785 105.987 18.094 105.987 19.686C105.987 21.292 107.39 22.601 109.091 22.601ZM122.858 34.017C122.872 31.345 124.464 29.78 126.785 29.78C129.093 29.78 130.482 31.291 130.469 33.828V46H136.218V32.803C136.218 27.972 133.384 25.003 129.066 25.003C125.989 25.003 123.762 26.514 122.831 28.93H122.588V25.273H117.11V46H122.858Z"
        fill="#F4F8FF"
      />
      <path
        d="M154.623 46H160.317L165.567 27.931H165.783L171.045 46H176.74L184.648 18.364H178.265L173.69 37.607H173.447L168.414 18.364H162.949L157.902 37.566H157.673L153.098 18.364H146.715ZM188.227 46H193.976V25.273H188.227ZM191.115 22.601C192.829 22.601 194.232 21.292 194.232 19.686C194.232 18.094 192.829 16.785 191.115 16.785C189.414 16.785 188.011 18.094 188.011 19.686C188.011 21.292 189.414 22.601 191.115 22.601ZM199.134 46H204.882V39.415L206.434 37.647L212.088 46H218.822L210.739 34.246L218.43 25.273H211.832L205.193 33.14H204.882V18.364H199.134ZM221.807 46H227.556V25.273H221.807ZM224.695 22.601C226.409 22.601 227.812 21.292 227.812 19.686C227.812 18.094 226.409 16.785 224.695 16.785C222.995 16.785 221.591 18.094 221.591 19.686C221.591 21.292 222.995 22.601 224.695 22.601Z"
        fill="url(#wikiGradient)"
      />
      <path
        d="M150 56C166 64 186 66 204 64C214 63 224 60 236 56"
        stroke="url(#underlineGradient)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
})
