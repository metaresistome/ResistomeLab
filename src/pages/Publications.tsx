import { BookOpen, BookMarked, GraduationCap, Fingerprint, ArrowUpRight, ExternalLink, FileText, Quote, BookCopy, Network } from 'lucide-react'
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
      {/* Page header with publication infographic */}
      <section className="relative overflow-hidden bg-primary pt-16 text-primary-foreground">
        <div className="absolute inset-0 bg-dot-grid-light" aria-hidden="true" />
        <img
          src="/images/page-publications.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/40"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">
              Publications
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Research output, made easy to follow.
            </h1>
          </Reveal>

          {/* Citation-network infographic */}
          <Reveal delay={0.15} className="hidden lg:block">
            <svg
              width="360"
              height="300"
              viewBox="0 0 360 300"
              fill="none"
              aria-hidden="true"
              className="opacity-90"
            >
              {/* connecting citation lines */}
              <g stroke="#7fc4c9" strokeOpacity="0.5" strokeWidth="1.5">
                <path d="M70 60 L175 95" />
                <path d="M70 60 L60 175" />
                <path d="M175 95 L285 60" />
                <path d="M175 95 L190 195" />
                <path d="M285 60 L300 160" />
                <path d="M60 175 L190 195" />
                <path d="M190 195 L300 160" />
                <path d="M60 175 L120 262" />
                <path d="M190 195 L120 262" />
                <path d="M300 160 L245 255" />
                <path d="M120 262 L245 255" />
              </g>
              {/* paper nodes */}
              <g>
                <circle cx="70" cy="60" r="30" fill="#0d4a52" stroke="#e8862d" strokeWidth="1.5" />
                <foreignObject x="52" y="42" width="36" height="36">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </foreignObject>
                <circle cx="285" cy="60" r="26" fill="#0d4a52" stroke="#7fc4c9" strokeWidth="1.5" />
                <foreignObject x="269" y="44" width="32" height="32">
                  <BookCopy className="h-4.5 w-4.5 text-primary-foreground" />
                </foreignObject>
                <circle cx="175" cy="95" r="34" fill="#e8862d" />
                <foreignObject x="155" y="75" width="40" height="40">
                  <Quote className="h-6 w-6 text-primary" />
                </foreignObject>
                <circle cx="60" cy="175" r="24" fill="#0d4a52" stroke="#7fc4c9" strokeWidth="1.5" />
                <foreignObject x="45" y="160" width="30" height="30">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </foreignObject>
                <circle cx="300" cy="160" r="28" fill="#0d4a52" stroke="#e8862d" strokeWidth="1.5" />
                <foreignObject x="283" y="143" width="34" height="34">
                  <BookMarked className="h-5 w-5 text-primary-foreground" />
                </foreignObject>
                <circle cx="190" cy="195" r="26" fill="#0d4a52" stroke="#7fc4c9" strokeWidth="1.5" />
                <foreignObject x="173" y="178" width="34" height="34">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </foreignObject>
                <circle cx="120" cy="262" r="22" fill="#0d4a52" stroke="#e8862d" strokeWidth="1.5" />
                <circle cx="245" cy="255" r="24" fill="#0d4a52" stroke="#7fc4c9" strokeWidth="1.5" />
                <foreignObject x="229" y="239" width="32" height="32">
                  <Network className="h-4.5 w-4.5 text-primary-foreground" />
                </foreignObject>
              </g>
              {/* citation count bubbles */}
              <g fill="#e8862d">
                <circle cx="100" cy="42" r="10" />
                <circle cx="315" cy="88" r="8" />
                <circle cx="34" cy="146" r="8" />
                <circle cx="215" cy="168" r="9" />
                <circle cx="95" cy="240" r="7" />
                <circle cx="272" cy="228" r="8" />
              </g>
              <g
                fontFamily="Inter, sans-serif"
                fontSize="9"
                fontWeight="700"
                fill="#0d4a52"
                textAnchor="middle"
              >
                <text x="100" y="45">24</text>
                <text x="315" y="91">8</text>
                <text x="34" y="149">5</text>
                <text x="215" y="171">12</text>
                <text x="95" y="243">3</text>
                <text x="272" y="231">6</text>
              </g>
            </svg>
          </Reveal>
        </div>
      </section>

      {/* Journal articles, year-wise */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Journal articles
          </p>
          <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Complete list, year by year.
          </h2>
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
