import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useEffect, useState } from "react";
import { vaultApi } from "@/lib/api";
import { Loader2, ImageOff } from "lucide-react";

// Cache blob URLs per vault file id (per session)
const blobCache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

async function resolveVaultBlob(fileId: string): Promise<string> {
  const cached = blobCache.get(fileId);
  if (cached) return cached;
  const inFlight = pending.get(fileId);
  if (inFlight) return inFlight;

  const p = (async () => {
    const res = await vaultApi.download(fileId);
    const url = URL.createObjectURL(res.data as Blob);
    blobCache.set(fileId, url);
    return url;
  })();
  pending.set(fileId, p);
  try {
    return await p;
  } finally {
    pending.delete(fileId);
  }
}

function VaultImageView({ node }: NodeViewProps) {
  const vaultId: string | null = node.attrs.vaultId ?? null;
  const alt: string = node.attrs.alt ?? "";
  const [src, setSrc] = useState<string | null>(node.attrs.src || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!vaultId) return;
    if (blobCache.has(vaultId)) {
      setSrc(blobCache.get(vaultId)!);
      return;
    }
    setError(false);
    resolveVaultBlob(vaultId)
      .then((url) => { if (!cancelled) setSrc(url); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [vaultId]);

  return (
    <NodeViewWrapper as="div" className="my-4">
      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <ImageOff className="h-4 w-4" /> Failed to load image
        </div>
      ) : src ? (
        <img
          src={src}
          alt={alt}
          className="rounded-lg max-w-full h-auto"
          draggable={false}
        />
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-6 text-sm text-muted-foreground justify-center">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading image…
        </div>
      )}
    </NodeViewWrapper>
  );
}

export const VaultImage = Node.create({
  name: "vaultImage",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      vaultId: { default: null },
      alt: { default: null },
      src: { default: null }, // optional fallback for non-vault images
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[data-vault-id]",
        getAttrs: (el) => ({
          vaultId: (el as HTMLElement).getAttribute("data-vault-id"),
          alt: (el as HTMLElement).getAttribute("alt"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { vaultId, src, alt } = HTMLAttributes as any;
    return [
      "img",
      mergeAttributes(
        { "data-vault-id": vaultId ?? undefined, alt: alt ?? undefined, src: src ?? undefined },
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VaultImageView);
  },
});
