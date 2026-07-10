import { LifeBuoy } from "@/lib/heroicons";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <a
          href="#/"
          className="mb-8 inline-flex text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground transition hover:text-foreground"
        >
          ← Back to home
        </a>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">About Continuum</h1>
        <p className="mt-4 text-sm text-muted-foreground">Your second brain, without the friction.</p>

        <section className="mt-12 space-y-10 text-foreground/90">
          <div>
            <h2 className="text-2xl font-semibold">What is Continuum?</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Continuum is a modern knowledge management platform designed to help you capture, connect,
              and rediscover your ideas at the speed of thought. Notes link themselves through mentions and
              topics, building a living graph of everything you care about.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Our philosophy</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              No folder mess, no rigid hierarchy — just pure flow. Your most relevant notes and entities
              resurface automatically based on how you actually use them, so your knowledge works for you.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Built to last</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Native sync across every device, full offline support, and a design that stays out of your way.
              Continuum is here to grow with your thinking over time.
            </p>
          </div>
        </section>

        <div className="mt-16 flex flex-wrap gap-4">
          <a
            href="#/support"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3 text-sm font-medium transition hover:border-foreground/30 hover:bg-card"
          >
            <LifeBuoy className="h-4 w-4" /> Visit the support center
          </a>
        </div>

        <p className="mt-16 text-sm text-muted-foreground">
          Get in touch at{" "}
          <a href="mailto:contact@continuum.onl" className="font-medium text-foreground hover:underline">
            contact@continuum.onl
          </a>
          .
        </p>
      </div>
    </div>
  );
}
