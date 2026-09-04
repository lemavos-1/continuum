import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";
import { FloatingCreateButton } from "@/components/ui/floating-create-button";
import { TodayHabitsCard } from "@/components/dashboard/TodayHabitsCard";
import { ScoreEvolutionCard } from "@/components/dashboard/ScoreEvolutionCard";
import { ActiveProjectsCard } from "@/components/dashboard/ActiveProjectsCard";

import { dashboardApi, graphApi, notesApi } from "@/lib/api";
import { useCreateNote } from "@/hooks/useCreateNote";
import UpgradeModal from "@/components/UpgradeModal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus } from "@/lib/heroicons";
import { Skeleton } from "@/components/ui/skeleton";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

const LOCALES: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-BR", fr: "fr-FR" };

const formatNoteDate = (timestamp: number | undefined, locale: string) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString(locale, { month: "short", day: "numeric" });
};

const DashboardSkeleton = () => (
  <AppLayout>
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-20 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Skeleton className="h-[200px] rounded-2xl lg:col-span-4" />
        <Skeleton className="h-[340px] rounded-2xl lg:col-span-8" style={{ animationDelay: "80ms" }} />
        <Skeleton className="h-[220px] rounded-2xl lg:col-span-4" style={{ animationDelay: "160ms" }} />
        <Skeleton className="h-[280px] rounded-2xl lg:col-span-8" style={{ animationDelay: "240ms" }} />
      </div>
    </div>
  </AppLayout>
);

/** Compact metric rail: one line of context, no chunky KPI boxes. */
function MetricRail({
  items,
  className,
}: {
  items: { label: string; value: string; hint?: string; delta?: number }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 divide-x divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card/40",
        className,
      )}
    >
      {items.map((item) => {
        const delta = item.delta ?? 0;
        return (
          <div key={item.label} className="min-w-0 px-3 py-3.5 sm:px-5 sm:py-4">
            <p className="truncate font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1.5 flex items-baseline gap-1.5 font-serif text-2xl leading-none tabular-nums text-foreground sm:text-3xl">
              <span className="truncate">{item.value}</span>
              {delta !== 0 && (
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    delta > 0 ? "text-emerald-400/80" : "text-red-400/80",
                  )}
                >
                  {delta > 0 ? "↑" : "↓"}
                  {Math.abs(delta)}
                </span>
              )}
            </p>
            {item.hint && (
              <p className="mt-1.5 truncate font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                {item.hint}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const locale = LOCALES[language] ?? "en-US";
  const [currentScore, setCurrentScore] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [showOnboardingPopup, setShowOnboardingPopup] = useState(false);
  const { createNote } = useCreateNote({ onLimitReached: () => setUpgradeOpen(true) });

  useEffect(() => {
    const isNewAccount = localStorage.getItem("newAccountCreated") === "true";
    if (isNewAccount) {
      setShowOnboardingPopup(true);
      localStorage.removeItem("newAccountCreated");
    }
  }, []);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => dashboardApi.summary().then((r) => r.data),
  });

  const { data: notes } = useQuery({
    queryKey: ["notes", "list"],
    queryFn: () => notesApi.list().then((r) => r.data),
  });

  const { data: graphData } = useQuery({
    queryKey: ["graph", "data"],
    queryFn: () => graphApi.data().then((r) => r.data),
  });

  const notesList = useMemo<any[]>(() => {
    if (Array.isArray(notes)) return notes;
    if (notes && typeof notes === "object") {
      return (notes as any).notes || (notes as any).data || (notes as any).content || [];
    }
    return [];
  }, [notes]);

  const recentNotes = useMemo(() => {
    const summaryNotes =
      summary?.recentNotes || (summary && typeof summary === "object" ? (summary as any).notes || (summary as any).data : null);
    if (Array.isArray(summaryNotes) && summaryNotes.length > 0) return summaryNotes.slice(0, 6);
    if (notesList.length === 0) return [];
    return [...notesList]
      .filter((note: any) => note && (note.createdAt || note.updatedAt))
      .sort((a: any, b: any) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime())
      .slice(0, 6)
      .map((note: any) => ({
        id: note.id,
        title: note.title,
        createdAtTimestamp: new Date(note.createdAt || note.updatedAt).getTime(),
      }));
  }, [summary, notesList]);

  const graphNodeCount = useMemo(() => {
    if ((graphData as any)?.nodes) return (graphData as any).nodes.length;
    if (Array.isArray(graphData)) return graphData.length;
    if (graphData && typeof graphData === "object") return (graphData as any).totalNodes || (graphData as any).count || 0;
    return 0;
  }, [graphData]);

  const totalNotes = useMemo(() => {
    if (summary?.stats?.totalNotes !== undefined) return summary.stats.totalNotes;
    if ((summary as any)?.totalNotes !== undefined) return (summary as any).totalNotes;
    return notesList.length;
  }, [summary, notesList]);

  const totalEntities = useMemo(() => {
    if (summary?.stats?.totalEntities !== undefined) return summary.stats.totalEntities;
    if ((summary as any)?.totalEntities !== undefined) return (summary as any).totalEntities;
    return 0;
  }, [summary]);

  const notesDelta = useMemo(() => {
    const now = Date.now();
    const WEEK = 7 * 24 * 60 * 60 * 1000;
    const inRange = (n: any, from: number, to: number) => {
      const ts = new Date(n?.createdAt || n?.updatedAt || 0).getTime();
      return ts >= from && ts < to;
    };
    const thisWeek = notesList.filter((n) => inRange(n, now - WEEK, now + 1)).length;
    const lastWeek = notesList.filter((n) => inRange(n, now - 2 * WEEK, now - WEEK)).length;
    return thisWeek - lastWeek;
  }, [notesList]);

  if (summaryLoading) return <DashboardSkeleton />;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return t("db_goodMorning");
    if (hour < 18) return t("db_goodAfternoon");
    return t("db_goodEvening");
  })();
  const displayName = user?.username || user?.email?.split("@")[0] || t("db_there");
  const todayLabel = new Date().toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });

  return (
    <AppLayout>
      <Stagger className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:space-y-5 sm:px-6 sm:py-10 lg:px-10" stagger={0.06}>
        {/* HEADER */}
        <StaggerItem>
          <header className="rounded-2xl border border-border/60 bg-card/40 px-4 py-5 sm:px-6 sm:py-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {todayLabel} · {t("db_last7days")}
            </p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h1 className="font-serif text-[1.75rem] leading-tight tracking-tight text-foreground sm:text-4xl">
                  {greeting}, {displayName}
                </h1>
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{t("db_subtitle")}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void createNote()}
                  className="h-10 min-w-[44px] gap-1.5 rounded-xl"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("db_newNote")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/insights")}
                  className="h-10 rounded-xl"
                >
                  {t("db_viewAll")}
                </Button>
              </div>
            </div>
          </header>
        </StaggerItem>

        {/* METRIC RAIL */}
        <StaggerItem>
          <MetricRail
            items={[
              { label: t("db_notes"), value: String(totalNotes), delta: notesDelta, hint: t("db_vsLastWeek") },
              { label: t("db_entities"), value: String(totalEntities), hint: t("db_nodes", { n: graphNodeCount }) },
              { label: t("db_score"), value: currentScore.toFixed(2), hint: t("db_gravityIndex") },
            ]}
          />
        </StaggerItem>

        {/* BODY — single column on mobile, 12-col grid on desktop */}
        <StaggerItem className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          <ScoreEvolutionCard onScoreChange={setCurrentScore} onOpenInsights={() => navigate("/insights")} />

          <TodayHabitsCard />

          <ActiveProjectsCard className="order-3 rounded-2xl lg:order-4 lg:col-span-4" />

          {/* RECENT NOTES */}
          <Card variant="faint" className="order-4 flex flex-col rounded-2xl lg:order-3 lg:col-span-8">
            <CardContent className="flex flex-1 flex-col p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{t("db_stream")}</p>
                  <h2 className="mt-1 truncate font-serif text-lg text-foreground sm:text-xl">{t("db_recentNotes")}</h2>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/notes")}
                  className="h-auto shrink-0 bg-transparent p-0 font-mono text-[11px] uppercase normal-case tracking-widest text-muted-foreground hover:bg-transparent hover:text-foreground"
                >
                  {t("db_viewAll")}
                </Button>
              </div>
              <div className="flex-1 space-y-1">
                {recentNotes.length > 0 ? (
                  recentNotes.map((note: any) => (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => navigate(`/notes/${note.id}`)}
                      className="group flex min-h-[44px] w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-left transition-colors hover:border-border hover:bg-accent/40"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium text-foreground/80 group-hover:text-foreground sm:text-sm">
                          {note.title || t("db_untitled")}
                        </span>
                        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          {formatNoteDate(note.createdAtTimestamp, locale)}
                        </span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/60" />
                    </button>
                  ))
                ) : (
                  <div className="flex h-full min-h-[88px] items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    {t("db_noRecentNotes")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} reason={t("db_notesLimitReason")} />

      {/* Onboarding popup after account creation */}
      <Dialog open={showOnboardingPopup} onOpenChange={setShowOnboardingPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{t("db_welcomeTitle")}</DialogTitle>
            <DialogDescription className="mt-2">{t("db_welcomeDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-foreground/80">
              {t("db_welcomeParagraphPart1")}{" "}
              <span className="font-semibold">{t("db_welcomeParagraphMarkdown")}</span> {t("db_welcomeParagraphPart2")}
            </p>
            <div className="rounded-xl border border-border/60 bg-accent/20 p-3">
              <p className="mb-2 text-xs text-muted-foreground">{t("db_importSupportsLabel")}</p>
              <ul className="space-y-1 text-xs text-foreground/70">
                <li>• {t("db_importSupport1")}</li>
                <li>• {t("db_importSupport2")}</li>
                <li>• {t("db_importSupport3")}</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="ghost" size="sm" onClick={() => setShowOnboardingPopup(false)} className="flex-1">
              {t("db_gotIt")}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowOnboardingPopup(false);
                navigate("/notes");
              }}
              className="flex-1"
            >
              {t("db_importNotesArrow")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FloatingCreateButton label={t("db_newNote")} onClick={() => void createNote()} icon={<Plus className="h-4 w-4" />} />
    </AppLayout>
  );
}
