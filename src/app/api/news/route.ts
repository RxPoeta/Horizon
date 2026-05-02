import { fetchAllNews } from '@/lib/newsService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const news = await fetchAllNews();
    return NextResponse.json(news);
  } catch (error) {
    console.error('API News Error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
