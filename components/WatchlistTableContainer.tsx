import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = {
  symbol: string;
  company: string;
  price?: number | null;
  changePct?: number | null;
  marketCap?: number | null;
  pe?: number | null;
  addedAt?: string;
};

type Props = {
  rows: Row[];
};

export default function WatchlistTableContainer({ rows }: Props) {
  const hasRows = Array.isArray(rows) && rows.length > 0;

  const fmtNumber = (n: number | null | undefined, digits = 2) =>
    typeof n === 'number' && Number.isFinite(n) ? n.toFixed(digits) : '—';

  const fmtPct = (n: number | null | undefined) =>
    typeof n === 'number' && Number.isFinite(n) ? `${n >= 0 ? '+' : ''}${n.toFixed(2)}%` : '—';

  const fmtCap = (n: number | null | undefined) => {
    if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return '—';
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(2)}T`;
    if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
    return n.toFixed(0);
  };

  return (
    <div className="w-full overflow-x-auto rounded-md border border-neutral-800 bg-neutral-900">
      <Table className="w-full text-sm">
        <TableCaption className="text-neutral-400">
          {hasRows
            ? `Total: ${rows.length} entrées`
            : "Votre watchlist est vide pour le moment."}
        </TableCaption>
        <TableHeader className="bg-neutral-800/60">
          <TableRow className="border-b border-neutral-800">
            {WATCHLIST_TABLE_HEADER.map((col) => (
              <TableHead
                key={col}
                className="px-4 py-3 text-left font-medium text-neutral-200 whitespace-nowrap"
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasRows ? (
            rows.map((row) => (
              <TableRow
                key={row.symbol}
                className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/30"
              >
                <TableCell className="px-4 py-3 text-left text-neutral-100">
                  {row.company}
                </TableCell>
                <TableCell className="px-4 py-3 text-left text-neutral-300">
                  {row.symbol}
                </TableCell>
                <TableCell className="px-4 py-3 text-left text-neutral-100">
                  {typeof row.price === 'number' ? `$${fmtNumber(row.price, 2)}` : '—'}
                </TableCell>
                <TableCell className={`px-4 py-3 text-left ${typeof row.changePct === 'number' ? (row.changePct >= 0 ? 'text-emerald-400' : 'text-red-400') : 'text-neutral-300'}`}>
                  {fmtPct(row.changePct)}
                </TableCell>
                <TableCell className="px-4 py-3 text-left text-neutral-300">
                  {fmtCap(row.marketCap)}
                </TableCell>
                <TableCell className="px-4 py-3 text-left text-neutral-300">
                  {fmtNumber(row.pe, 2)}
                </TableCell>
                <TableCell className="px-4 py-3 text-left text-neutral-300">—</TableCell>
                <TableCell className="px-4 py-3 text-left text-neutral-300">—</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={WATCHLIST_TABLE_HEADER.length}
                className="px-4 py-6 text-left text-neutral-400"
              >
                Aucune action suivie. Utilisez l’étoile dans la recherche pour ajouter des titres à votre liste.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
