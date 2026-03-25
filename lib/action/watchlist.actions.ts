'use server';

import { connectToDatabase } from '@/Database/mongoose';
import { Watchlist } from '@/Database/models/watchlist.models';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        // Better Auth stores users in the "user" collection
        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        return items.map((i) => String(i.symbol));
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

export type WatchlistMutationResult = { ok: boolean; reason?: string };

export async function addToWatchlist(
    email: string,
    symbol: string,
    company: string
): Promise<WatchlistMutationResult> {
    if (!email) return { ok: false, reason: 'Missing email' };
    if (!symbol) return { ok: false, reason: 'Missing symbol' };

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
        if (!user) return { ok: false, reason: 'User not found' };

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return { ok: false, reason: 'Invalid user id' };

        const cleanSymbol = String(symbol).trim().toUpperCase();
        let cleanCompany = String(company ?? '').trim();

        // Server-side fallback: if company name is missing, try to fetch it from Finnhub
        if (!cleanCompany) {
            try {
                const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';
                if (token) {
                    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(cleanSymbol)}&token=${token}`;
                    const resp = await fetch(url, { cache: 'no-store' });
                    if (resp.ok) {
                        const data = (await resp.json().catch(() => ({}))) as Record<string, unknown>;
                        const name = (data?.name as string | undefined)?.trim();
                        if (name) cleanCompany = name;
                    }
                }
            } catch (e) {
                console.warn('addToWatchlist: failed to backfill company from Finnhub for', cleanSymbol, e);
            }
        }

        if (!cleanCompany) {
            // As a last resort, use symbol itself as company label to avoid blocking the add
            cleanCompany = cleanSymbol;
        }

        try {
            await Watchlist.create({ userId, symbol: cleanSymbol, company: cleanCompany });
            return { ok: true };
        } catch (e: any) {
            // Duplicate key error => already in watchlist: treat as idempotent success
            if (e && (e.code === 11000 || String(e.message || '').includes('duplicate'))) {
                return { ok: true };
            }
            console.error('addToWatchlist error:', e);
            return { ok: false, reason: 'Failed to add to watchlist' };
        }
    } catch (err) {
        console.error('addToWatchlist fatal error:', err);
        return { ok: false, reason: 'Unexpected error' };
    }
}

export async function removeFromWatchlist(email: string, symbol: string): Promise<WatchlistMutationResult> {
    if (!email) return { ok: false, reason: 'Missing email' };
    if (!symbol) return { ok: false, reason: 'Missing symbol' };

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
        if (!user) return { ok: false, reason: 'User not found' };

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return { ok: false, reason: 'Invalid user id' };

        const cleanSymbol = String(symbol).trim().toUpperCase();
        await Watchlist.deleteOne({ userId, symbol: cleanSymbol });
        // Idempotent: even if nothing was deleted, consider success
        return { ok: true };
    } catch (err) {
        console.error('removeFromWatchlist error:', err);
        return { ok: false, reason: 'Failed to remove from watchlist' };
    }
}

export interface WatchlistListItem {
    symbol: string;
    company: string;
    addedAt: string; // ISO string for transport
}

export async function getWatchlistItemsByEmail(email: string): Promise<WatchlistListItem[]> {
    if (!email) return [];
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Watchlist.find(
            { userId },
            { symbol: 1, company: 1, addedAt: 1, _id: 0 }
        ).lean();

        return (items || []).map((i) => ({
            symbol: String(i.symbol),
            company: String((i as any).company),
            addedAt: new Date((i as any).addedAt ?? Date.now()).toISOString(),
        }));
    } catch (err) {
        console.error('getWatchlistItemsByEmail error:', err);
        return [];
    }
}