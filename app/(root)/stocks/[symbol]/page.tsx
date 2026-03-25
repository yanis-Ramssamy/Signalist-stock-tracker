import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistStar from "@/components/WatchlistStar";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { getWatchlistSymbolsByEmail } from "@/lib/action/watchlist.actions";
import {
    SYMBOL_INFO_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    BASELINE_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

export default async function StockDetails({ params }: StockDetailsPageProps) {
    const { symbol } = await params;
    const upper = symbol.toUpperCase();

    // Determine initial watchlist state for current user (fail gracefully)
    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null as any);
    const email = session?.user?.email as string | undefined;
    const symbols = email ? await getWatchlistSymbolsByEmail(email) : [];
    const isInWatchlist = symbols.includes(upper);
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
            <section className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    {/* Left column */}
                    <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}symbol-info.js`}
                            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                            height={170}
                        />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                        className="custom-chart"
                        height={600}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={BASELINE_WIDGET_CONFIG(symbol)}
                        className="custom-chart"
                        height={600}
                    />
                    </div>

                    {/* Right column */}
                    <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <WatchlistStar
                                symbol={upper}
                                company={upper}
                                initialInWatchlist={isInWatchlist}
                            />
                        </div>

                        <TradingViewWidget
                        scriptUrl={`${scriptUrl}technical-analysis.js`}
                        config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                        height={400}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}company-profile.js`}
                        config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                        height={440}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}financials.js`}
                        config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                        height={464}
                    />
                    </div>
                </div>
            </section>
        </div>
    );
}
