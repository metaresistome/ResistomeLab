import { BookOpen, BookMarked, GraduationCap, Fingerprint, ArrowUpRight, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { site } from '@/data/site'
import {
  publications,
  bookChapters,
  publicationYears,
  publicationLink,
  type Publication,
} from '@/data/publications'

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

function HighlightedAuthors({ authors }: { authors: string }) {
  const parts = authors.split('Shafiq, M.')
  if (parts.length === 1) return <>{authors}</>
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <strong className="font-semibold text-foreground">Shafiq, M.</strong>}
        </span>
      ))}
    </>
  )
}

function PublicationEntry({ pub, index }: { pub: Publication; index: number }) {
  return (
    <Reveal delay={Math.min(index * 0.03, 0.15)}>
      <a
        href={publicationLink(pub)}
        target="_blank"
        rel="noreferrer"
        className="group block border-b border-border py-5 transition-colors last:border-b-0 hover:bg-secondary/40 sm:-mx-4 sm:px-4"
      >
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          <HighlightedAuthors authors={pub.authors} />
        </p>
        <p className="font-display mt-1.5 text-[17px] font-semibold leading-snug tracking-tight text-foreground decoration-primary decoration-2 underline-offset-4 group-hover:underline">
          {pub.title}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed">
          <em className="font-bold italic text-foreground/85">{pub.journal}</em>
          <span className="text-muted-foreground">, {pub.details}</span>
        </p>
        <span className="mt-2 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {pub.role && (
            <span className="rounded-full bg-accent/10 px-2.5 py-1 font-semibold uppercase tracking-wide text-accent">
              {pub.role}
            </span>
          )}
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            <ExternalLink className="h-3.5 w-3.5" />
            {pub.doi ? 'View article (DOI)' : 'Search on Google Scholar'}
          </span>
        </span>
      </a>
    </Reveal>
  )
}

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

      {/* Journal articles, year-wise */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Journal articles
          </p>
          <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Complete list, year by year.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Click any entry to open the article. The PI’s name is highlighted in each author list;
            journal names appear in <strong className="font-semibold">bold italic</strong>.
          </p>
        </Reveal>

        <div className="mt-14 space-y-16">
          {publicationYears.map((year) => (
            <div
              key={year}
              className="grid gap-6 md:grid-cols-[110px_1fr] md:gap-10"
            >
              <div className="md:sticky md:top-28 md:self-start">
                <Reveal>
                  <p className="font-display text-5xl font-semibold tracking-tight text-primary/25 sm:text-6xl">
                    {year}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {publications.filter((p) => p.year === year).length} articles
                  </p>
                </Reveal>
              </div>
              <div className="min-w-0">
                {publications
                  .filter((p) => p.year === year)
                  .map((pub, i) => (
                    <PublicationEntry key={pub.title} pub={pub} index={i} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Book chapters */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              <BookMarked className="h-4 w-4" />
              Book chapters
            </p>
            <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Chapters in edited volumes.
            </h2>
          </Reveal>

          <div className="mt-10 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card px-6 sm:px-8">
            {bookChapters.map((pub, i) => (
              <PublicationEntry key={pub.title} pub={pub} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Scholarly routes */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Verified scholarly records
          </p>
          <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Find the broader publication record.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Citation metrics, preprints, and the live, always-current record are maintained on the
            profiles below.
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
      </section>

      <CtaBand />
    </div>
  )
}
