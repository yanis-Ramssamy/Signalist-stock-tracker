'use client';


// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';
import useTradingViewWidget from "@/components/hooks/useTradingViewWidget";
import {cn} from "@/lib/utils";

interface TradingViewWidgetProps {
    title?: string;
    scriptUrl: string;
    config : Record<string, unknown>;
    height?: number;
    className?: string;
}

function TradingViewWidget({title, scriptUrl, config, height = 600, className}: TradingViewWidgetProps) {
    const containerRef = useTradingViewWidget(scriptUrl, config, height);


    return (
        <div className={"w-full"}>
            {title && <h3 className={"font-bold text-2xl text-gray-100 mb-5"}>{title}</h3>}
            <div className={cn("tradingview-widget-container", className)} ref={containerRef} >
                <div className="tradingview-widget-container_widget" style={{ height, width: "100%" }}/>
            </div>
        </div>


    );
}

export default memo(TradingViewWidget);
