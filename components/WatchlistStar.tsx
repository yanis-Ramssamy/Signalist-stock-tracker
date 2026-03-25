"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  symbol: string;
  company: string;
  initialInWatchlist?: boolean;
  onToggle?: (inWatchlist: boolean) => void;
  size?: number;
};

export default function WatchlistStar({
  symbol,
  company,
  initialInWatchlist = false,
  onToggle,
  size = 18,
}: Props) {
  const [inWatchlist, setInWatchlist] = useState<boolean>(initialInWatchlist);
  const [pending, setPending] = useState(false);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    const next = !inWatchlist;
    // Optimistic UI
    setInWatchlist(next);
    onToggle?.(next);
    setPending(true);

    try {
      const res = await fetch("/api/watchlist", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          next
            ? { symbol, company }
            : { symbol }
        ),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || data.ok === false) {
        // rollback on failure
        setInWatchlist(!next);
        onToggle?.(!next);
      }
    } catch {
      // rollback on error
      setInWatchlist(!next);
      onToggle?.(!next);
    } finally {
      setPending(false);
    }
  };

  const activeClasses = inWatchlist
    ? "text-yellow-400 fill-yellow-400"
    : "text-gray-500 hover:text-yellow-400";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={inWatchlist ? "Retirer de la watchlist" : "Ajouter à la watchlist"}
      title={inWatchlist ? "Retirer de la watchlist" : "Ajouter à la watchlist"}
      disabled={pending}
      className={`ml-3 inline-flex items-center justify-center rounded p-1 transition-colors ${activeClasses} ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <Star
        size={size}
        className={inWatchlist ? "stroke-yellow-400" : "stroke-current"}
      />
    </button>
  );
}
