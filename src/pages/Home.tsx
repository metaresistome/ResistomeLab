import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, BookOpen } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { LiveResistome } from '@/components/LiveResistome'
import {
  site,
  researchAreas,
  approachSteps,
  featuredPublication,
} from '@/data/site'

const marqueeWords = [
  'Antimicrobial resistance',
  'Genomics',
  'One Health',
  'Metagenomics',
  'Wastewater surveillance',
  'Bioinformatics',
  'Meta-analysis',
]

export function Home() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-dot-grid opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Resistome Lab · {site.affiliation}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="font-display mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Mapping the resistome across{' '}
                <em className="text-primary">humans, animals,</em> and{' '}
                <em className="text-accent">environments</em>.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                We trace antimicrobial-resistance genes, mobile elements, and microbial
                communities across clinical and environmental settings — connecting genomics,
                metagenomics, and One Health surveillance into one research program.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/research"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Explore our research
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Meet the PI
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-primary shadow-2xl shadow-primary/30">
              <div className="absolute inset-0 bg-dot-grid-light" aria-hidden="true" />
              <LiveResistome className="aspect-[4/3] w-full sm:aspect-square" />
              <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full bg-primary/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Live · natural selection
              </div>
              {[
                { label: 'Human', pos: 'left-1/2 top-[42%] -translate-x-1/2' },
                { label: 'Animal', pos: 'left-[24%] top-[90%] -translate-x-1/2' },
                { label: 'Environment', pos: 'left-[76%] top-[90%] -translate-x-1/2' },
              ].map((l) => (
                <span
                  key={l.label}
                  className={`pointer-events-none absolute z-10 inline-flex items-center gap-1.5 rounded-full bg-primary/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/80 backdrop-blur ${l.pos}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {l.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-border bg-secondary/60 py-4">
        <motion.div
          className="flex w-max items-center gap-8 whitespace-nowrap mask-fade-r"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.24em] text-foreground/60">
              {w}
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Intro statement ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Resistance is a system,{' '}
              <em className="text-primary">not a single sample</em>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Resistome Lab brings molecular data together with environmental, clinical, and
              population contexts — creating a practical research home for the questions that
              emerge between disciplines. Across microbes, environments, and communities, the
              right data can reveal what resistance is doing next.
            </p>
            <Link
              to="/research"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              A connected research agenda
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <div className="relative mt-10">
              <div
                className="absolute -inset-2.5 rounded-[1.75rem] bg-accent/10"
                aria-hidden="true"
              />
              <img
                src="/images/hero.jpg"
                alt="Abstract microbial ecosystem — bacteria, plasmids and DNA networks"
                className="relative aspect-[16/10] w-full rounded-3xl border border-border object-cover shadow-lg"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur">
                signal · environment · genome
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Research areas ───────────────────────────────── */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                Research areas
              </p>
              <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Three vantage points, one connected question.
              </h2>
            </div>
            <Link
              to="/research"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-card/60"
            >
              All research
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {researchAreas.map((area, i) => (
              <Reveal key={area.id} delay={i * 0.1}>
                <Link
                  to="/research"
                  className="group block overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={area.image}
                      alt={area.imageAlt}
                      className="aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="font-display absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-sm font-semibold text-primary backdrop-blur">
                      {area.index}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {area.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {area.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approach ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            How we work
          </p>
          <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            From sample to insight.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From environmental signal to pathogen intelligence — a consistent path through every
            project.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {approachSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <div className="relative h-full rounded-3xl border border-border bg-card p-7">
                <span className="font-display text-5xl font-semibold text-primary/15">
                  {s.step}
                </span>
                <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Featured publication ─────────────────────────── */}
      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="relative mx-auto max-w-7xl overflow-hidden px-5 py-20 sm:px-8 lg:py-24">
          <div className="absolute inset-0 bg-dot-grid-light" aria-hidden="true" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/75">
                <BookOpen className="h-3.5 w-3.5" />
                {featuredPublication.kind}
              </p>
              <h2 className="font-display mt-5 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {featuredPublication.title}
              </h2>
              <p className="mt-4 text-primary-foreground/75">
                {featuredPublication.journal} · {featuredPublication.year}
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed text-primary-foreground/80">
                {featuredPublication.summary}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <a
                href={featuredPublication.doi}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Read the review
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PI teaser ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-3 rounded-[2rem] bg-primary/10" aria-hidden="true" />
              <img
                src="/images/pi-portrait.webp"
                alt="Dr. Muhammad Shafiq in a microbiology laboratory"
                className="relative aspect-[3/4] w-full rounded-[1.75rem] border border-border object-cover object-top shadow-xl"
              />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Principal investigator
            </p>
            <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Evidence that connects people, pathogens, and places.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Dr. Muhammad Shafiq is an Associate Professor in the Department of Clinical Pharmacy
              at Shantou University Medical College. His work investigates antimicrobial
              resistance within a One Health framework.
            </p>
            <Link
              to="/about"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              About the PI
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
