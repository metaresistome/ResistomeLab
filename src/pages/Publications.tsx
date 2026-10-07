import { BookOpen, GraduationCap, Fingerprint, ArrowUpRight } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { featuredPublication, site } from '@/data/site'

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
        subtitle="A growing record of verified papers, research outputs, and scholarly routes connected to Resistome Lab."
        image="/images/page-publications.jpg"
        imageAlt="Scientific literature and microbiology still life"
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
                {featuredPublication.journal} · {featuredPublication.year}
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
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {profileLinks.map((link, i) => (
              <Reveal key={link.label} delay={i * 0.08}>
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
