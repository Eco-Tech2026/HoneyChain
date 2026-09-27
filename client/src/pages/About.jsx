export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-mist">About TraceGuard</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-mist-dim">
        <p>
          Most people find out their email has been exposed only after something goes wrong \u2014
          a suspicious login, spam surge, or a friend asking "did you mean to send me this?".
          TraceGuard exists to move that discovery earlier, using only legitimate and public
          sources.
        </p>
        <p>
          We built TraceGuard around one rule above everything else: this is an exposure and
          awareness tool, not an account-hacking or account-enumeration tool. Every scanner in the
          system is designed to check what has already happened and been publicly reported \u2014
          never to attempt access to anything private.
        </p>
        <p>
          The scan engine is modular by design. Breach data, domain checks, and public web
          exposure each run as independent scanners, so the product can grow to support more
          legitimate data providers over time without changing how findings are presented or how
          privacy is protected.
        </p>
        <p>
          TraceGuard is informational. It cannot guarantee discovery of every place an email has
          ever been used, and its exposure score is a heuristic, not a certified security rating.
          We say so plainly throughout the product rather than overselling what a scan can find.
        </p>
      </div>
    </div>
  );
}
