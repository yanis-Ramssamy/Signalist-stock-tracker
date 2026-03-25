"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import {searchStocks} from "@/lib/action/finnhub.actions";
import {useDebounce} from "@/components/hooks/useDebounce";
import WatchlistStar from "@/components/WatchlistStar";

export default function SearchCommand({ renderAs = 'button', label = 'Ajouter une action', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpen(v => !v)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])
    const handleSearch = async () => {
        if(!isSearchMode) return setStocks(initialStocks);

        setLoading(true)
        try {
            const results = await searchStocks(searchTerm.trim());
            setStocks(results);
        } catch {
            setStocks([])
        } finally {
            setLoading(false)
        }
    }



    const debouncedSearch = useDebounce(handleSearch, 300);

    useEffect(() => {
        debouncedSearch();
    }, [searchTerm]);

    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm("");
        setStocks(initialStocks);
    }

  return (
    <>
        {renderAs === 'text' ? (
            <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
        ): (
            <Button onClick={() => setOpen(true)} className="search-btn">
                {label}
            </Button>
        )}
      <CommandDialog open={open} onOpenChange={setOpen} className={"search-dialog"}>

          <div className={"search-field"}>
              <CommandInput
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  placeholder="Rechercher des actions..."
                  className="search-input"
              />

              {loading && <Loader2 className="search-loader" />}
          </div>
          <CommandList className={"search-list"}>
              {loading ? (
                  <CommandEmpty className="search-list-empty">Chargement des actions...</CommandEmpty>
              ) : displayStocks?.length === 0 ? (
                  <div className="search-list-indicator">
                      {isSearchMode ? 'Aucun résultat' : 'Aucune action disponible'}
                  </div>
              ) : (
                  <ul>
                      <div className="search-count">
                          {isSearchMode ? 'Résultats de recherche' : 'Actions populaires'}
                          {` `}({displayStocks?.length || 0})
                      </div>
                      {displayStocks?.map((stock) => (
                        <li key={stock.symbol} className="search-item flex items-center gap-3">
                          <Link
                            href={`/stocks/${stock.symbol}`}
                            onClick={handleSelectStock}
                            className="search-item-link flex items-center gap-3 flex-1"
                          >
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                              <div className="search-item-name">{stock.name}</div>
                              <div className="text-sm text-gray-500">
                                {stock.symbol} | {stock.exchange} | {stock.type}
                              </div>
                            </div>
                          </Link>
                          <WatchlistStar
                            symbol={stock.symbol}
                            company={stock.name}
                            initialInWatchlist={Boolean(stock.isInWatchlist)}
                            onToggle={(inList) => {
                              setStocks((prev) =>
                                (prev || []).map((s) =>
                                  s.symbol === stock.symbol ? { ...s, isInWatchlist: inList } : s
                                )
                              );
                            }}
                          />
                        </li>
                      ))}
                  </ul>
              )
              }
        </CommandList>
      </CommandDialog>
    </>
  );
}
