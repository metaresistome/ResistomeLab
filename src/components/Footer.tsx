import { Link } from 'react-router-dom'
import { Mail, MapPin, GraduationCap, Fingerprint, Linkedin, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { navItems, site } from '@/data/site'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-dot-grid-light" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-primary-foreground/10 p-1.5">
                <Logo className="h-8 w-8" />
              </span>
              <span className="font-display text-xl font-semibold">Resistome Lab</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
              A research laboratory for antimicrobial resistance, infectious diseases, genomic
              surveillance, metagenomics, and bioinformatics — within a One Health framework.
            </p>
            <p className="mt-6 font-display text-lg italic text-primary-foreground/85">
              “Resistance is a system, not a single sample.”
            </p>
            <img
              src="/images/sumc-logo.png"
              alt="Shantou University Medical College"
              className="mt-6 h-9 w-auto rounded-md bg-white/95 px-2 py-1"
            />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/60">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/60">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/60" />
                <span>
                  <a href={`mailto:${site.email}`} className="block hover:text-primary-foreground">
                    {site.email}
                  </a>
                  <a
                    href={`mailto:${site.emailUniversity}`}
                    className="block text-primary-foreground/65 hover:text-primary-foreground"
                  >
                    {site.emailUniversity}
                  </a>
                </span>
              </li>
              {site.phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/60" />
                  <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-primary-foreground">
                    {site.phone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/60" />
                <span>
                  {site.department}
                  <br />
                  {site.affiliation}
                  <br />
                  {site.address}
                </span>
              </li>
            </ul>
            <div className="mt-5 flex gap-2.5">
              <a
                href={site.links.scholar}
                target="_blank"
                rel="noreferrer"
                aria-label="Google Scholar"
                className="rounded-full bg-primary-foreground/10 p-2.5 transition-colors hover:bg-primary-foreground/20"
              >
                <GraduationCap className="h-4 w-4" />
              </a>
              <a
                href={site.links.orcid}
                target="_blank"
                rel="noreferrer"
                aria-label="ORCID"
                className="rounded-full bg-primary-foreground/10 p-2.5 transition-colors hover:bg-primary-foreground/20"
              >
                <Fingerprint className="h-4 w-4" />
              </a>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-full bg-primary-foreground/10 p-2.5 transition-colors hover:bg-primary-foreground/20"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Resistome Lab · {site.affiliation}
          </span>
          <span className="uppercase tracking-[0.22em]">{site.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
