import { useEffect, useState } from "react";
import api from "@/lib/api";

/** Price text read from Stripe via backend. Never converts currencies locally. */
export function useVisionPrice() {
  const [label, setLabel] = useState<string>("—");
  useEffect(() => {
    api.get("/api/plans/prices").then(({ data }) => {
      const d = data?.vision?.monthlyDisplay;
      if (!d?.currency || d.unitAmount == null) return;
      const fmt = (cur: string, amt: number) =>
        new Intl.NumberFormat(undefined, { style: "currency", currency: cur.toUpperCase() }).format(amt / 100);
      const parts = [fmt(d.currency, d.unitAmount)];
      const brl = d.currencyOptions?.brl;
      if (brl != null && d.currency !== "brl") parts.push(fmt("brl", brl));
      setLabel(parts.join(" · "));
    }).catch(() => {});
  }, []);
  return label;
}
