import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/better-auth/auth';
import { addToWatchlist, removeFromWatchlist } from '@/lib/action/watchlist.actions';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null as any);
    const email = session?.user?.email as string | undefined;
    if (!email) {
      return NextResponse.json({ ok: false, reason: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null as any);
    const symbol = body?.symbol as string | undefined;
    const company = body?.company as string | undefined;
    if (!symbol || !company) {
      return NextResponse.json({ ok: false, reason: 'Missing symbol/company' }, { status: 400 });
    }

    const res = await addToWatchlist(email, symbol, company);
    const status = res.ok ? 200 : 400;
    if (res.ok) {
      // Ensure the Watchlist page reflects latest data on next visit
      try { revalidatePath('/watchlist'); } catch {}
    }
    return NextResponse.json(res, { status });
  } catch (e) {
    console.error('POST /api/watchlist error', e);
    return NextResponse.json({ ok: false, reason: 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null as any);
    const email = session?.user?.email as string | undefined;
    if (!email) {
      return NextResponse.json({ ok: false, reason: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null as any);
    const symbol = body?.symbol as string | undefined;
    if (!symbol) {
      return NextResponse.json({ ok: false, reason: 'Missing symbol' }, { status: 400 });
    }

    const res = await removeFromWatchlist(email, symbol);
    const status = res.ok ? 200 : 400;
    if (res.ok) {
      try { revalidatePath('/watchlist'); } catch {}
    }
    return NextResponse.json(res, { status });
  } catch (e) {
    console.error('DELETE /api/watchlist error', e);
    return NextResponse.json({ ok: false, reason: 'Unexpected error' }, { status: 500 });
  }
}
