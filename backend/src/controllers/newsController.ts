import { Request, Response } from 'express';

interface NewsArticle {
  id: string;
  headline: string;
  description: string;
  published: string;
  link: string;
  image?: string;
  author?: string;
}

// Simple in-process cache to avoid hammering ESPN
let newsCache: { articles: NewsArticle[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

async function fetchESPNNews(): Promise<NewsArticle[]> {
  const url = 'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/news?limit=12';
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`ESPN API responded ${res.status}`);
  const data = await res.json() as any;

  const articles: NewsArticle[] = (data.articles ?? []).map((a: any) => ({
    id: String(a.dataSourceIdentifier ?? a.id ?? Math.random()),
    headline: a.headline ?? 'No headline',
    description: a.description ?? '',
    published: a.published ?? new Date().toISOString(),
    link: a.links?.web?.href ?? '#',
    image: a.images?.[0]?.url ?? null,
    author: a.byline ?? null,
  }));

  return articles;
}

export const getNews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = Date.now();

    if (newsCache && now - newsCache.fetchedAt < CACHE_TTL_MS) {
      res.json({ success: true, data: { articles: newsCache.articles, cached: true } });
      return;
    }

    const articles = await fetchESPNNews();
    newsCache = { articles, fetchedAt: now };

    res.json({ success: true, data: { articles, cached: false } });
  } catch (error: any) {
    console.error('getNews error:', error.message);
    // Return cached if available even if stale
    if (newsCache) {
      res.json({ success: true, data: { articles: newsCache.articles, cached: true, stale: true } });
      return;
    }
    res.status(503).json({ success: false, message: 'News service unavailable' });
  }
};
