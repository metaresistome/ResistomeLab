import { Link } from 'react-router-dom'
import { GraduationCap, Fingerprint, Linkedin, MapPin, Mail, BookOpen } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { site, principles } from '@/data/site'

export function About() {
  return (
    <div>
      <PageHeader
        kicker="Principal investigator"
        title="Dr. Muhammad Shafiq"
        subtitle="Associate Professor · AMR · One Health — Department of Clinical Pharmacy, Shantou University Medical College"
        image="/images/page-profile.jpg"
      />

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Portrait + facts */}
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <div className="relative">
                <div className="absolute -inset-3 rounded-[2rem] bg-primary/10" aria-hidden="true" />
                <img
                  src="/images/pi-portrait.webp"
                  alt="Dr. Muhammad Shafiq in a microbiology laboratory"
                  className="relative aspect-[3/4] w-full rounded-[1.75rem] border border-border object-cover object-top shadow-xl"
                />
                <span className="absolute bottom-5 left-5 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
                  Image record / PI-01
                </span>
              </div>

              <div className="mt-8 space-y-4 rounded-3xl border border-border bg-card p-7">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {site.department}, {site.affiliation}
                    <br />
                    {site.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${site.email}`} className="text-sm font-medium hover:underline">
                    {site.email}
                  </a>
                </div>
                <div className="flex gap-2.5 pt-2">
                  <a
                    href={site.links.scholar}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Google Scholar"
                    className="rounded-full bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <GraduationCap className="h-4 w-4" />
                  </a>
                  <a
                    href={site.links.orcid}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="ORCID"
                    className="rounded-full bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Fingerprint className="h-4 w-4" />
                  </a>
                  <a
                    href={site.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="rounded-full bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <div>
            <Reveal>
              <h2 className="font-display text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Evidence that connects <em className="text-primary">people, pathogens,</em> and{' '}
                <em className="text-accent">places</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Dr. Muhammad Shafiq is an Associate Professor in the Department of Clinical
                Pharmacy at Shantou University Medical College. His work investigates
                antimicrobial resistance within a One Health framework.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                The research traces the occurrence, distribution, and fate of antibiotics,
                resistance determinants, and potential human pathogens across environmental
                settings — bringing microbiology, data interpretation, and public-health context
                into the same conversation.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <h3 className="font-display mt-14 text-2xl font-semibold tracking-tight">
                A research home for connected questions
              </h3>
            </Reveal>
            <div className="mt-6 space-y-5">
              {principles.map((p, i) => (
                <Reveal key={p.title} delay={0.05 * i}>
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <h4 className="font-display text-lg font-semibold tracking-tight">{p.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/publications"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  <BookOpen className="h-4 w-4" />
                  Selected publications
                </Link>
                <a
                  href={site.links.scholar}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Google Scholar profile
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
