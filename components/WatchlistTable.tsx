"use client";

import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";

const sampleRows = [
  {
    company: "Apple Inc.",
    symbol: "AAPL",
    price: "$192.32",
    change: "+1.24%",
    marketCap: "$2.95T",
    pe: "33.1",
    alert: "—",
    action: "—",
  },
  {
    company: "NVIDIA Corporation",
    symbol: "NVDA",
    price: "$926.32",
    change: "+0.87%",
    marketCap: "$2.34T",
    pe: "72.4",
    alert: "—",
    action: "—",
  },
];

export default function WatchlistTable() {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-neutral-800 bg-neutral-900">
      <table className="w-full caption-bottom text-sm">
        <thead className="bg-neutral-800/60">
          <tr className="border-b border-neutral-800">
            {WATCHLIST_TABLE_HEADER.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left font-medium text-neutral-200 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sampleRows.map((row, idx) => (
            <tr
              key={`${row.symbol}-${idx}`}
              className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/30"
            >
              <td className="px-4 py-3 text-left text-neutral-100">{row.company}</td>
              <td className="px-4 py-3 text-left text-neutral-300">{row.symbol}</td>
              <td className="px-4 py-3 text-left text-neutral-100">{row.price}</td>
              <td className="px-4 py-3 text-left text-emerald-400">{row.change}</td>
              <td className="px-4 py-3 text-left text-neutral-300">{row.marketCap}</td>
              <td className="px-4 py-3 text-left text-neutral-300">{row.pe}</td>
              <td className="px-4 py-3 text-left text-neutral-300">{row.alert}</td>
              <td className="px-4 py-3 text-left text-neutral-300">{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
