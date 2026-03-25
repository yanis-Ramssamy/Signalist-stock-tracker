import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { getWatchlistItemsByEmail } from "@/lib/action/watchlist.actions";
import { getWatchlistSnapshot } from "@/lib/action/finnhub.actions";
import WatchlistTableContainer from "@/components/WatchlistTableContainer";

export default async function WatchlistPage() {
  // Get current session via Better Auth; fail gracefully
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null as any);
  const email = session?.user?.email as string | undefined;

  const items = email ? await getWatchlistItemsByEmail(email) : [];
  const symbols = items.map((i) => i.symbol);
  const fallbackCompanies = Object.fromEntries(items.map((i) => [i.symbol, i.company] as const));
  const snapshot = symbols.length > 0 ? await getWatchlistSnapshot(symbols, fallbackCompanies) : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-100">Watchlist</h1>
        <p className="text-sm text-neutral-400">Vos actions suivies</p>
      </div>

      <WatchlistTableContainer rows={snapshot} />
    </div>
  );
}
