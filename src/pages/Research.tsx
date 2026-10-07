import { Link } from 'react-router-dom'
import { ArrowRight, Check, Compass, Layers, FileCheck2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { researchAreas, approachSteps, principles } from '@/data/site'

const principleIcons = [Compass, Layers, FileCheck2]

export function Research() {
  return (
    <div>
      <PageHeader
        kicker="Research"
        title="Evidence across scales."
        subtitle="The research agenda is structured around the relationships between resistance determinants, microbial communities, environmental exposure, and health outcomes — from environmental signal to pathogen intelligence."
        image="/images/page-research.jpg"
        imageAlt="Abstract environmental surveillance and genomic research illustration"
      />

      {/* Areas in detail */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="space-y-20">
          {researchAreas.map((area, i) => (
            <Reveal key={area.id}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="relative">
                  <div
                    className={`absolute -inset-3 rounded-[2rem] ${
                      i % 2 === 0 ? 'bg-primary/10' : 'bg-accent/10'
                    }`}
                    aria-hidden="true"
                  />
                  <img
                    src={area.image}
                    alt={area.imageAlt}
                    className="relative aspect-[5/4] w-full rounded-[1.75rem] border border-border object-cover shadow-xl"
                  />
                  <span className="font-display absolute left-6 top-6 rounded-full bg-background/90 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur">
                    {area.index}
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                    {area.title}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {area.summary}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {area.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm leading-relaxed text-foreground/85">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Approach
            </p>
            <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              From sample to insight.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {approachSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-border bg-card p-7">
                  <span className="font-display text-5xl font-semibold text-primary/15">
                    {s.step}
                  </span>
                  <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A research home for <em className="text-primary">connected questions</em>.
            </h2>
            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Have a question that crosses a boundary?
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <div className="space-y-6">
            {principles.map((p, i) => {
              const Icon = principleIcons[i % principleIcons.length]
              return (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="flex gap-5 rounded-3xl border border-border bg-card p-6">
                    <span className="h-fit rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {p.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
