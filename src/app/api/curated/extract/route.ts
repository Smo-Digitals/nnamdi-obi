import { NextRequest, NextResponse } from 'next/server';

function og(html: string, prop: string): string {
  return (
    html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1] ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'))?.[1] ||
    ''
  );
}

function meta(html: string, name: string): string {
  return (
    html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1] ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'))?.[1] ||
    ''
  );
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  let parsed: URL;
  try { parsed = new URL(url); }
  catch { return NextResponse.json({ error: 'Invalid URL' }, { status: 400 }); }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NnamdioiBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const title =
      og(html, 'title') ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
      '';

    const description =
      og(html, 'description') ||
      meta(html, 'description') ||
      '';

    const image_url = og(html, 'image') || '';

    const source_name =
      og(html, 'site_name') ||
      parsed.hostname.replace(/^www\./, '');

    const author =
      html.match(/<meta[^>]+name=["']author["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
      og(html, 'article:author') ||
      '';

    return NextResponse.json({ url, title, description, image_url, source_name, author });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed to fetch URL' }, { status: 500 });
  }
}
