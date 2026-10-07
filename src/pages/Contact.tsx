import { useState } from 'react'
import type { FormEvent } from 'react'
import { Mail, MapPin, Building2, Send, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

const enquiryTypes = [
  'Collaboration proposal',
  'Research enquiry',
  'Student enquiry',
  'Data partnership',
  'Project discussion',
]

export function Contact() {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [subject, setSubject] = useState(enquiryTypes[0])
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const body = encodeURIComponent(`${message}\n\n— ${name}`)
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
      `[Resistome Lab] ${subject}`,
    )}&body=${body}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <div>
      <PageHeader
        kicker="Contact"
        title="Collaboration & enquiries."
        subtitle="Research questions are better when they can travel."
      />

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Info side */}
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Please use email for collaboration proposals, research and student enquiries,
                prospective data partnerships, or project discussions.
              </p>
            </Reveal>

            <div className="mt-10 space-y-5">
              <Reveal delay={0.05}>
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center gap-5 rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                >
                  <span className="rounded-2xl bg-primary/10 p-3.5 text-primary">
                    <Mail className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Email
                    </p>
                    <p className="mt-1 font-medium group-hover:underline">{site.email}</p>
                  </div>
                </a>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="flex items-center gap-5 rounded-3xl border border-border bg-card p-6">
                  <span className="rounded-2xl bg-primary/10 p-3.5 text-primary">
                    <Building2 className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Affiliation
                    </p>
                    <p className="mt-1 font-medium">
                      {site.department}
                      <br />
                      {site.affiliation}
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="rounded-3xl border border-border bg-card p-6">
                  <img
                    src="/images/sumc-logo.png"
                    alt="Shantou University Medical College logo"
                    className="h-12 w-auto"
                  />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Resistome Lab is part of {site.affiliation} — a medical campus at the
                    intersection of clinical care, public health, and biomedical research.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="flex items-center gap-5 rounded-3xl border border-border bg-card p-6">
                  <span className="rounded-2xl bg-primary/10 p-3.5 text-primary">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Address
                    </p>
                    <p className="mt-1 font-medium">{site.address}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Form side */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lg sm:p-10">
              {sent ? (
                <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                  <span className="rounded-full bg-primary/10 p-4 text-primary">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h2 className="font-display mt-6 text-3xl font-semibold tracking-tight">
                    Your mail app should be open
                  </h2>
                  <p className="mt-3 max-w-sm text-muted-foreground">
                    We’ve prepared your message to {site.email}. If nothing happened, write to us
                    directly at{' '}
                    <a href={`mailto:${site.email}`} className="font-medium text-primary hover:underline">
                      {site.email}
                    </a>
                    .
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                  >
                    Compose another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="font-display text-3xl font-semibold tracking-tight">
                      Write to Resistome Lab
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This opens your email client with the message pre-filled.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Your name
                      </span>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Enquiry type
                      </span>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
                      >
                        {enquiryTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Message
                    </span>
                    <textarea
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your research question, collaboration idea, or enquiry…"
                      className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    Send via email
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        {/* Campus */}
        <Reveal delay={0.1}>
          <div className="relative mt-16 overflow-hidden rounded-3xl border border-border shadow-xl">
            <img
              src="/images/sumc-campus.jpg"
              alt="Shantou University Medical College campus"
              className="aspect-[21/9] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">
                Our campus
              </p>
              <p className="font-display mt-2 text-2xl font-semibold text-primary-foreground sm:text-3xl">
                {site.affiliation} · Shantou, China
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
