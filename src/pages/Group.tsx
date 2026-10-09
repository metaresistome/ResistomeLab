import { Link } from 'react-router-dom'
import { Users, Network, GraduationCap, ArrowRight, Mail, FlaskConical } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { students, groupCards } from '@/data/site'

const groupIcons = [Users, Network, GraduationCap]

export function Group() {
  return (
    <div>
      <PageHeader
        kicker="Group"
        title="An open research network."
        subtitle="Make expertise visible when it is ready to be shared — a connected agenda for AMR, pathogen genomics, and One Health surveillance."
      />

      {/* Master's students */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Our team
          </p>
          <h2 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            The people behind the signals.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {students.map((student, i) => (
            <Reveal key={student.name} delay={i * 0.08}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10">
                <div className="relative bg-secondary/60">
                  <img
                    src={student.photo}
                    alt={student.photoAlt}
                    className="aspect-[3/4] w-full object-cover object-top"
                  />
                  <span className="absolute bottom-4 left-4 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground">
                    {student.program}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-semibold leading-snug tracking-tight">
                    {student.name}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {student.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {student.bio}
                  </p>
                  {student.email && (
                    <a
                      href={`mailto:${student.email}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {student.email}
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Growing the network */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal className="max-w-3xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Verified group profiles, training opportunities, alumni stories, and laboratory
              collaborations can be added here as the network grows. Until then, this page outlines
              the kinds of research connections Resistome Lab is built to support.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {groupCards.map((card, i) => {
              const Icon = groupIcons[i % groupIcons.length]
              return (
                <Reveal key={card.title} delay={i * 0.08}>
                  <div className="h-full rounded-3xl border border-border bg-card p-8">
                    <span className="rounded-2xl bg-primary/10 p-3.5 text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="font-display mt-6 text-2xl font-semibold tracking-tight">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {card.text}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 sm:p-10 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-balance text-3xl font-semibold tracking-tight">
                Interested in a research conversation or training pathway?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Resistome Lab welcomes new collaborations and prospective students as the group
                grows.
              </p>
            </div>
            <Link
              to="/contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <FlaskConical className="h-4 w-4" />
              Get in touch
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </div>
  )
}
