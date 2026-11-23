import { LogoMark } from './Logo'

/**
 * The Autoone star-lattice as a faint watermark fixed behind the whole site.
 * It sits above the section backgrounds but below all content (content has z-index 1), so it shows
 * through translucent cards like frosted glass and never blocks clicks.
 */
export function SiteMark() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <LogoMark
        color="#3D7BFF"
        className="absolute left-1/2 top-1/2 h-[92vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.07] lg:-end-[10vmin] lg:start-auto lg:left-auto lg:translate-x-0"
      />
    </div>
  )
}
