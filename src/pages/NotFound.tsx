import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Reveal } from '@/components/Reveal'

export function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-dot-grid px-5 pt-16">
      <div className="relative text-center">
        <Reveal>
          <Logo className="mx-auto h-14 w-14" />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            404 · Page not found
          </p>
          <h1 className="font-display mt-4 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
            This page is not in the current record.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-muted-foreground">
            The page may have moved, or the address may be incomplete. Return to the Resistome
            Lab home to continue exploring the research.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>
            <Link
              to="/research"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              <Compass className="h-4 w-4" />
              Explore research
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
