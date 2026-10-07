import { BookOpen, ArrowUpRight, PenLine } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { newsItems, site } from '@/data/site'

export function News() {
  const [featured, ...rest] = newsItems

  return (
    <div>
      <PageHeader
        kicker="News"
        title="Field notes & research updates."
        subtitle="New papers, fieldwork, conferences, datasets, grants, collaborations, and upcoming opportunities from Resistome Lab."
      />

      {/* Featured story */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <a
            href={featured.href}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="grid lg:grid-cols-[1.15fr_1fr]">
              <div className="relative min-h-[260px] overflow-hidden">
                <img
                  src="/images/page-publications.jpg"
                  alt="Scientific literature and microbiology still life"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">
                    {featured.date}
                  </span>
                  <span className="text-muted-foreground">{featured.category}</span>
                </div>
                <h2 className="font-display mt-5 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {featured.text}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {featured.linkLabel ?? 'Read the publication'}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </a>
        </Reveal>

        {/* Other channels */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {rest.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-border bg-card p-8">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                  <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                    {item.date}
                  </span>
                  <span className="text-muted-foreground">{item.category}</span>
                </div>
                <h3 className="font-display mt-5 text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                  >
                    {item.linkLabel ?? 'Read more'}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Submit update */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <span className="rounded-2xl bg-primary-foreground/10 p-3">
                <PenLine className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  Keep the record precise
                </h3>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
                  Have a verified update to share? Research updates can include new papers,
                  fieldwork, conferences, datasets, grants, collaborations, and upcoming
                  opportunities.
                </p>
              </div>
            </div>
            <a
              href={`mailto:${site.email}?subject=Resistome%20Lab%20news%20update`}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Share an update
              <BookOpen className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </div>
  )
}
