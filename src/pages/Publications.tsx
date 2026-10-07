import { BookOpen, GraduationCap, Fingerprint, ArrowUpRight, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { featuredPublication, selectedPublications, site } from '@/data/site'

const profileLinks = [
  {
    label: 'Google Scholar',
    note: 'Citation record and h-index',
    href: site.links.scholar,
    icon: GraduationCap,
  },
  {
    label: 'ORCID',
    note: '0000-0002-4346-5903',
    href: site.links.orcid,
    icon: Fingerprint,
  },
  {
    label: 'ResearchGate',
    note: 'Full-text publications & projects',
    href: site.links.researchgate,
    icon: BookOpen,
  },
  {
    label: 'LinkedIn',
    note: 'Professional profile',
    href: site.links.linkedin,
    icon: ArrowUpRight,
  },
]

export function Publications() {
  return (
    <div>
      <PageHeader
        kicker="Publications"
        title="Research output, made easy to follow."
        subtitle="89 peer-reviewed outputs (83 journal articles, 6 book chapters) — 23 as first or corresponding author, with 1,700+ citations."
        image="/images/page-publications.jpg"
        imageAlt="Scientific literature and citation networks"
      />

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg sm:p-12">
            <div
              className="absolute right-0 top-0 h-full w-1/3 bg-dot-grid opacity-50"
              aria-hidden="true"
            />
            <div className="relative max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                <BookOpen className="h-3.5 w-3.5" />
                {featuredPublication.kind}
              </p>
              <h2 className="font-display mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {featuredPublication.title}
              </h2>
              <p className="mt-4 font-medium text-foreground/80">
                {featuredPublication.journal} · {featuredPublication.year} · IF 16.3 (Q1)
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {featuredPublication.summary}
              </p>
              <a
                href={featuredPublication.doi}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Read via DOI
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Selected publications */}
        <div className="mt-24">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Selected publications
            </p>
            <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              First & corresponding-author work.
            </h2>
          </Reveal>

          <div className="mt-10 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
            {selectedPublications.map((pub, i) => (
              <Reveal key={pub.doi} delay={Math.min(i * 0.04, 0.2)}>
                <a
                  href={pub.doi}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-3 p-6 transition-colors hover:bg-secondary/50 sm:grid-cols-[64px_1fr_auto] sm:items-center sm:gap-6 sm:p-7"
                >
                  <span className="font-display text-2xl font-semibold text-primary/30 transition-colors group-hover:text-primary sm:text-3xl">
                    {pub.year}
                  </span>
                  <span>
                    <span className="font-display block text-lg font-semibold leading-snug tracking-tight decoration-primary decoration-2 underline-offset-4 group-hover:underline">
                      {pub.title}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/75">{pub.journal}</span>
                      <span aria-hidden="true">·</span>
                      <span>{pub.role}</span>
                    </span>
                  </span>
                  <span className="hidden rounded-full border border-border p-2.5 text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground sm:block">
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-6 text-sm text-muted-foreground">
              A complete record of 83 journal articles and 6 book chapters is available through the
              verified scholarly profiles below.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Scholarly routes */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Verified scholarly records
            </p>
            <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Find the broader publication record.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              The Resistome Lab archive will grow with verified papers, datasets, project pages,
              and related research outputs. For the current scholarly record, follow the profile
              links below.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {profileLinks.map((link, i) => (
              <Reveal key={link.label} delay={i * 0.06}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <link.icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                  <div className="mt-8">
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {link.label}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{link.note}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
