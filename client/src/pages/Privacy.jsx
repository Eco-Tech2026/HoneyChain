export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-mist">Privacy Policy</h1>
      <p className="mt-2 text-xs font-mono text-mist-faint">Last updated: 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-mist-dim">
        <PolicySection title="What we collect">
          <p>
            When you run a scan, the email address you enter is sent directly to our scan engine
            to query legitimate breach, domain, and public-web data sources. It is not written to
            application logs in full \u2014 logs only ever contain a masked form, such as{' '}
            <span className="font-mono text-mist">na****@gmail.com</span>.
          </p>
        </PolicySection>

        <PolicySection title="What we store">
          <p>
            By default, TraceGuard does not permanently store the email address you scan or the
            resulting report. Scan results are returned to your browser for that session only. If
            we ever introduce optional persistent history, it will be opt-in and clearly labeled.
          </p>
        </PolicySection>

        <PolicySection title="What we don't do">
          <p>
            We do not sell or share your email address or scan results with third parties for
            marketing purposes. If analytics are enabled on this site, raw email addresses are
            never sent to analytics providers.
          </p>
        </PolicySection>

        <PolicySection title="Third-party data sources">
          <p>
            Breach information comes from established providers such as Have I Been Pwned. Public
            exposure information comes from licensed search APIs, where configured. Each provider
            has its own privacy practices governing how it processes a query.
          </p>
        </PolicySection>

        <PolicySection title="Data deletion">
          <p>
            Because scan results are not stored by default, there is typically nothing to delete.
            If you've opted into persistent storage of a report, contact us and we will remove it.
          </p>
        </PolicySection>
      </div>
    </div>
  );
}

function PolicySection({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-base font-semibold text-mist">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
