import { Reveal } from './Reveal'

type PageHeaderProps = {
  kicker: string
  title: string
  subtitle?: string
  image?: string
  imageAlt?: string
}

export function PageHeader({ kicker, title, subtitle, image, imageAlt }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-primary pt-16 text-primary-foreground">
      <div className="absolute inset-0 bg-dot-grid-light" aria-hidden="true" />
      {image && (
        <img
          src={image}
          alt={imageAlt ?? ''}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/40" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">
            {kicker}
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
