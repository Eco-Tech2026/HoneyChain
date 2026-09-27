export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-mist">Terms of Service</h1>
      <p className="mt-2 text-xs font-mono text-mist-faint">Last updated: 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-mist-dim">
        <TermsSection title="Acceptable use">
          <p>
            You may use TraceGuard to check exposure information for an email address you own or
            are authorized to check. You may not use TraceGuard to harass, stalk, or investigate
            another person without their consent, or to attempt to gain unauthorized access to any
            account or system.
          </p>
        </TermsSection>

        <TermsSection title="No guarantee of completeness">
          <p>
            TraceGuard checks legitimate, publicly available, and licensed data sources. It cannot
            guarantee discovery of every breach or every place an email address has ever appeared.
            A clean result means no matching exposure was found in the sources checked \u2014 not
            that the email is guaranteed safe.
          </p>
        </TermsSection>

        <TermsSection title="No account access">
          <p>
            TraceGuard never attempts to log in to, enumerate, or otherwise access any third-party
            account. It reports only on information from legitimate breach providers, public web
            indexes, and public DNS records.
          </p>
        </TermsSection>

        <TermsSection title="Service availability">
          <p>
            Some findings depend on third-party providers (such as breach databases or search
            APIs) that may be rate-limited, temporarily unavailable, or discontinued. TraceGuard
            will clearly indicate when a scan is partial due to a provider issue.
          </p>
        </TermsSection>

        <TermsSection title="Changes">
          <p>
            We may update these terms as the product evolves. Continued use of TraceGuard after an
            update constitutes acceptance of the revised terms.
          </p>
        </TermsSection>
      </div>
    </div>
  );
}

function TermsSection({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-base font-semibold text-mist">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
