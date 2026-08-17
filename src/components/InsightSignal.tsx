import { useEffect, useState } from "react";
import { insightsApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FireIcon, SparklesIcon, ArrowPathIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Loads insights once per session and resolves the most relevant
 * badge for a given note/entity id (hot / forgotten / key / none).
 *
 * Cached in-module so listings don't refetch per row.
 */

type Kind = "note" | "entity";
type CacheEntry = {
  byId: Map<string, { badge: string; score: number; category: "hot" | "forgotten" }>;
  fetchedAt: number;
};

const CACHE: Record<Kind, CacheEntry | null> = { note: null, entity: null };
const CACHE_TTL_MS = 5 * 60 * 1000;

let pending: Record<Kind, Promise<CacheEntry> | null> = { note: null, entity: null };

async function loadCache(kind: Kind): Promise<CacheEntry> {
  const existing = CACHE[kind];
  if (existing && Date.now() - existing.fetchedAt < CACHE_TTL_MS) return existing;
  if (pending[kind]) return pending[kind]!;

  pending[kind] = (async () => {
    const [hot, forgotten] = await Promise.all(
      kind === "note"
        ? [insightsApi.hotNotes(50), insightsApi.forgottenNotes(50)]
        : [insightsApi.hotEntities(50), insightsApi.forgottenEntities(50)]
    );
    const byId = new Map<string, { badge: string; score: number; category: "hot" | "forgotten" }>();
    (hot.data || []).forEach((it: any) => {
      const id = kind === "note" ? it.note?.id : it.entity?.id;
      if (id) byId.set(id, { badge: it.badge || "Hot", score: it.score, category: "hot" });
    });
    (forgotten.data || []).forEach((it: any) => {
      const id = kind === "note" ? it.note?.id : it.entity?.id;
      if (!id) return;
      if (!byId.has(id)) byId.set(id, { badge: it.badge || "Forgotten Gem", score: it.score, category: "forgotten" });
    });
    const entry = { byId, fetchedAt: Date.now() };
    CACHE[kind] = entry;
    pending[kind] = null;
    return entry;
  })();
  return pending[kind]!;
}

export function useInsightSignal(kind: Kind, id?: string) {
  const [data, setData] = useState<{ badge: string; score: number; category: "hot" | "forgotten" } | null>(null);
  useEffect(() => {
    if (!id) return;
    let active = true;
    loadCache(kind)
      .then((cache) => {
        if (!active) return;
        setData(cache.byId.get(id) || null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [kind, id]);
  return data;
}


const BADGE_KEY_MAP: Record<string, string> = {
  "hot right now": "ins_badge_hot",
  "worth revisiting": "ins_badge_worth_revisiting",
  "forgotten gem": "ins_badge_forgotten_gem",
  "key entity": "ins_badge_key_entity",
  "hot": "ins_badge_hot",
};

const BADGE_STYLE: Record<
  string,
  { icon: typeof FireIcon; classes: string }
> = {
  "hot right now": { icon: FireIcon, classes: "border-orange-500/30 bg-orange-500/10 text-orange-300" },
  hot: { icon: FireIcon, classes: "border-orange-500/30 bg-orange-500/10 text-orange-300" },
  "worth revisiting": { icon: ArrowPathIcon, classes: "border-sky-500/30 bg-sky-500/10 text-sky-300" },
  "forgotten gem": { icon: SparklesIcon, classes: "border-violet-500/30 bg-violet-500/10 text-violet-300" },
  "key entity": { icon: KeyIcon, classes: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
};

export function InsightSignalBadge({ kind, id, className }: { kind: Kind; id?: string; className?: string }) {
  const { t } = useLanguage();
  const signal = useInsightSignal(kind, id);
  const [open, setOpen] = useState(false);
  if (!signal) return null;

  const key = signal.badge?.toLowerCase()?.trim() || "";
  const style = BADGE_STYLE[key] || {
    icon: signal.category === "hot" ? FireIcon : SparklesIcon,
    classes:
      signal.category === "hot"
        ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
        : "border-violet-500/30 bg-violet-500/10 text-violet-300",
  };
  const Icon = style.icon;
  const label = BADGE_KEY_MAP[key] ? t(BADGE_KEY_MAP[key]) : signal.badge;
  const help = signal.category === "hot" ? t("ins_badge_hot_help") : t("ins_badge_forgotten_help");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          title={`${label} — ${help}`}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen((v) => !v);
          }}
          className={cn(
            "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors hover:brightness-125",
            style.classes,
            className
          )}
        >
          <Icon className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-60 p-3"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center gap-2">
          <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-full border", style.classes)}>
            <Icon className="h-3 w-3" />
          </span>
          <p className="text-sm font-medium text-foreground">{label}</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {signal.category === "hot" ? t("ins_badge_hot_help") : t("ins_badge_forgotten_help")}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground/70">
          score {signal.score.toFixed(1)}
        </p>
      </PopoverContent>
    </Popover>
  );
}
