import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-primary-foreground sm:px-14">
          <div className="absolute inset-0 bg-dot-grid-light" aria-hidden="true" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground/65">
                Collaboration
              </p>
              <h2 className="font-display mt-3 max-w-xl text-balance text-3xl font-semibold leading-tight sm:text-4xl">
                Let’s read the next signal together.
              </h2>
              <p className="mt-3 max-w-lg text-primary-foreground/80">
                Resistome Lab welcomes research discussions that connect environmental signals,
                microbial data, and actionable public-health questions.
              </p>
            </div>
            <Link
              to="/contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
