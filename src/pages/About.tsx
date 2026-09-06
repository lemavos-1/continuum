import { useLanguage } from "@/contexts/LanguageContext";
import AppLogo from "@/components/landing/AppLogo";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import type { ComponentType, SVGProps } from "react";
import {
  ArrowUpRight,
  Code,
  Lock,
  HardDrive,
  Activity,
  GlobeAlt,
  Eye,
  Bug,
  Sparkles,
  Edit,
  Link,
  BarChart3,
  Download,
  Cloud,
  Check,
  ArrowLeft,
} from "@/lib/heroicons";

const GITHUB_URL = "https://github.com/continuumnodes/continuum";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
      {children}
    </h2>
  );
}

function Card({
  icon: IconEl,
  title,
  desc,
}: {
  icon?: Icon;
  title: string;
  desc: string;
}) {
  return (
    <div className="bento-card group">
      {IconEl && (
        <div className="bento-icon-box mb-3">
          <IconEl className="h-4.5 w-4.5" />
        </div>
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{desc}</p>
    </div>
  );
}

function FlowStep({
  icon: IconEl,
  title,
  desc,
  last = false,
}: {
  icon: Icon;
  title: string;
  desc: string;
  last?: boolean;
}) {
  return (
    <li className="relative flex gap-4">
      {!last && (
        <span className="absolute left-[19px] top-10 h-[calc(100%-2rem)] w-px bg-border" />
      )}
      <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-card">
        <IconEl className="h-4.5 w-4.5 text-muted-foreground" />
      </span>
      <div className="pb-8">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}

export default function About() {
  const { t } = useLanguage();

  const whatPoints = [
    t("ab_what_p1"),
    t("ab_what_p2"),
    t("ab_what_p3"),
    t("ab_what_p4"),
    t("ab_what_p5"),
    t("ab_what_p6"),
    t("ab_what_p7"),
  ];

  const steps = [t("ab_step1"), t("ab_step2"), t("ab_step3"), t("ab_step4")];

  const flow: { icon: Icon; title: string; desc: string }[] = [
    { icon: GlobeAlt, title: t("ab_how_frontend_t"), desc: t("ab_how_frontend_d") },
    { icon: Activity, title: t("ab_how_api_t"), desc: t("ab_how_api_d") },
    { icon: Lock, title: t("ab_how_auth_t"), desc: t("ab_how_auth_d") },
    { icon: HardDrive, title: t("ab_how_db_t"), desc: t("ab_how_db_d") },
    { icon: Cloud, title: t("ab_how_storage_t"), desc: t("ab_how_storage_d") },
  ];

  const ossCards = [
    { icon: Code, title: "GitHub", desc: t("ab_oss_github_d") },
    { icon: Activity, title: "Backend", desc: t("ab_oss_backend_d") },
    { icon: GlobeAlt, title: "Frontend", desc: t("ab_oss_frontend_d") },
    { icon: HardDrive, title: "Architecture", desc: t("ab_oss_arch_d") },
    { icon: Bug, title: "Issues", desc: t("ab_oss_issues_d") },
  ];

  const techGroups: { label: string; items: string[] }[] = [
    { label: t("ab_tech_backend"), items: ["Java", "Spring Boot", "REST API"] },
    { label: t("ab_tech_frontend"), items: ["React", "TypeScript"] },
    { label: t("ab_tech_data"), items: ["MongoDB"] },
    { label: t("ab_tech_storage"), items: ["Backblaze B2"] },
    { label: t("ab_tech_infra"), items: ["Redis", "Stripe"] },
    { label: t("ab_tech_auth"), items: ["JWT", "Google OAuth"] },
  ];

  const noteFlow = [
    { icon: Edit, text: t("ab_note_s1") },
    { icon: Download, text: t("ab_note_s2") },
    { icon: Link, text: t("ab_note_s3") },
    { icon: BarChart3, text: t("ab_note_s4") },
    { icon: Sparkles, text: t("ab_note_s5") },
  ];

  const whyCards = [
    { icon: Eye, title: t("ab_why_inspect_t"), desc: t("ab_why_inspect_d") },
    { icon: Bug, title: t("ab_why_improve_t"), desc: t("ab_why_improve_d") },
    { icon: Sparkles, title: t("ab_why_contribute_t"), desc: t("ab_why_contribute_d") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <AppLogo />
            <span className="font-serif text-[1.05rem] font-semibold tracking-tight text-foreground">
              Continuum
            </span>
          </a>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/" className="inline-flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                {t("ab_back_to_home")}
              </a>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                <Code className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* 1. Hero */}
        <section className="py-16 sm:py-24">
          <span className="cx-badge cx-badge-accent inline-flex items-center gap-1.5">
            <Code className="h-3.5 w-3.5" />
            {t("ab_badge")}
          </span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("ab_hero_title")}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
            {t("ab_hero_sub")}
          </p>
          <Button className="mt-8" asChild>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              {t("ab_hero_cta")}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </section>

        {/* 2. What is Continuum */}
        <section className="border-t border-border py-14 sm:py-20">
          <Eyebrow>Continuum</Eyebrow>
          <SectionTitle>{t("ab_what_title")}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
            {t("ab_what_body")}
          </p>

          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {whatPoints.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
                {p}
              </li>
            ))}
          </ul>

          {/* Capture → Connect → Understand → Resurface */}
          <div className="mt-10 grid gap-3 sm:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s} className="relative">
                <div className="bento-card text-center">
                  <span className="eyebrow">0{i + 1}</span>
                  <p className="mt-1.5 font-serif text-lg tracking-tight text-foreground">{s}</p>
                </div>
                {i < steps.length - 1 && (
                  <span className="absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-border sm:block" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. How it works */}
        <section className="border-t border-border py-14 sm:py-20">
          <Eyebrow>{t("ab_how_title")}</Eyebrow>
          <SectionTitle>{t("ab_how_title")}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
            {t("ab_how_sub")}
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="bento-card text-center">
                <p className="font-serif text-xl tracking-tight text-foreground">{t("ab_how_user")}</p>
              </div>
              <div className="mx-auto h-6 w-px bg-border" />
              <div className="rounded-lg border border-dashed border-border bg-card/50 px-5 py-4 text-center text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                Continuum
              </div>
            </div>
            <ul>
              {flow.map((f, i) => (
                <FlowStep
                  key={f.title}
                  icon={f.icon}
                  title={f.title}
                  desc={f.desc}
                  last={i === flow.length - 1}
                />
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Your data */}
        <section className="border-t border-border py-14 sm:py-20">
          <div className="bento-card">
            <div className="flex items-center gap-3">
              <span className="bento-icon-box">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
                {t("ab_data_title")}
              </h2>
            </div>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              {t("ab_data_body1")}
            </p>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground/80">
              {t("ab_data_body2")}
            </p>
            <p className="mt-6 border-l-2 border-border pl-4 text-[13px] leading-6 text-muted-foreground/70">
              {t("ab_data_note")}
            </p>
          </div>
        </section>

        {/* 5. Open Source */}
        <section className="border-t border-border py-14 sm:py-20">
          <Eyebrow>{t("ab_badge")}</Eyebrow>
          <SectionTitle>{t("ab_oss_title")}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
            {t("ab_oss_body")}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ossCards.map((c) => (
              <Card key={c.title} icon={c.icon} title={c.title} desc={c.desc} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                {t("ab_oss_cta")}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                {t("ab_oss_contribute")}
              </a>
            </Button>
          </div>
        </section>

        {/* 6. Technology */}
        <section className="border-t border-border py-14 sm:py-20">
          <Eyebrow>{t("ab_tech_title")}</Eyebrow>
          <SectionTitle>{t("ab_tech_title")}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
            {t("ab_tech_sub")}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techGroups.map((g) => (
              <div key={g.label} className="bento-card">
                <p className="eyebrow">{g.label}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="bento-tag"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. From note to knowledge */}
        <section className="border-t border-border py-14 sm:py-20">
          <Eyebrow>Continuum</Eyebrow>
          <SectionTitle>{t("ab_note_title")}</SectionTitle>

          <ul className="mt-10">
            {noteFlow.map((s, i) => (
              <li key={s.text} className="relative flex gap-4">
                {i < noteFlow.length - 1 && (
                  <span className="absolute left-[19px] top-10 h-[calc(100%-2rem)] w-px bg-border" />
                )}
                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card">
                  <s.icon className="h-4.5 w-4.5 text-muted-foreground" />
                </span>
                <p className="pb-7 pt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 8. Why open source */}
        <section className="border-t border-border py-14 sm:py-20">
          <Eyebrow>{t("ab_why_title")}</Eyebrow>
          <SectionTitle>{t("ab_why_lead")}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
            {t("ab_why_body")}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {whyCards.map((c) => (
              <Card key={c.title} icon={c.icon} title={c.title} desc={c.desc} />
            ))}
          </div>
        </section>

        {/* 9. Story */}
        <section className="border-t border-border py-14 sm:py-20">
          <Eyebrow>{t("ab_story_title")}</Eyebrow>
          <div className="mt-3 max-w-2xl">
            <p className="font-serif text-2xl leading-snug tracking-tight text-foreground/85 sm:text-[1.7rem]">
              “{t("ab_story_p1")}”
            </p>
            <p className="mt-5 text-[15px] leading-7 text-muted-foreground">{t("ab_story_p2")}</p>
          </div>
        </section>

        {/* 10. Final CTA */}
        <section className="border-t border-border py-16 sm:py-24">
          <div className="text-center">
            <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-5xl">
              {t("ab_cta_title")}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <a href="/" className="inline-flex items-center gap-2">
                  {t("ab_cta_try")}
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  {t("ab_cta_github")}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <p className="mx-auto mt-10 max-w-xl text-xs leading-5 text-muted-foreground/70">
              {t("ab_disclaimer")}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
