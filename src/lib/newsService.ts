import Parser from 'rss-parser';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  imageUrl?: string;
  score: number;
  author: string;
  authorInitials: string;
  aiVerification?: {
    summary: string;
    bias: 'low' | 'medium' | 'high';
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
      ['media:thumbnail', 'media:thumbnail'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

const SOURCES = [
  { name: 'Reuters', url: 'https://www.reutersagency.com/feed/?best-topics=world&post_type=best', category: 'Mundo' },
  { name: 'BBC', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'Mundo' },
  { name: 'Xataka', url: 'https://www.xataka.com/feed/full', category: 'Tecnología' },
  { name: 'CNN', url: 'http://rss.cnn.com/rss/edition_world.rss', category: 'Mundo' },
  { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss', category: 'Mundo' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Tecnología' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'Tecnología' },
  { name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', category: 'Mundo' },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'Mundo' },
  { name: 'Nature', url: 'https://www.nature.com/nature.rss', category: 'Ciencia' }
];

export async function fetchAllNews(): Promise<NewsItem[]> {
  const newsPromises = SOURCES.map(async (source) => {
    try {
      // Using a proxy or direct fetch if allowed
      // In a real server-side Next.js environment, this works directly
      const feed = await parser.parseURL(source.url);
      
      return feed.items.map((item, idx) => {
        const score = calculateHorizonScore(item, source.name);
        return {
          id: item.guid || `${source.name}-${idx}`,
          title: item.title || 'Sin título',
          description: item.contentSnippet || item.content || '',
          link: item.link || '#',
          pubDate: item.pubDate || new Date().toISOString(),
          source: source.name,
          category: source.category,
          imageUrl: extractImage(item),
          score: score,
          author: item.creator || source.name,
          authorInitials: getInitials(item.creator || source.name),
        };
      });
    } catch (error) {
      console.error(`Error fetching ${source.name}:`, error);
      return [];
    }
  });

  const allNews = await Promise.all(newsPromises);
  return allNews.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

function calculateHorizonScore(item: any, source: string): number {
  // Horizon Scoring Logic:
  // 1. Source Trustworthiness (40%)
  // 2. Recency (30%)
  // 3. Content Quality (30%)
  
  let score = 5.0; // Base score
  
  // Source weight
  const trusted = ['Reuters', 'BBC', 'Nature', 'Xataka'];
  if (trusted.includes(source)) score += 2.0;
  
  // Recency weight
  const pubDate = new Date(item.pubDate);
  const diffHours = (new Date().getTime() - pubDate.getTime()) / (1000 * 60 * 60);
  if (diffHours < 1) score += 2.0;
  else if (diffHours < 6) score += 1.0;
  
  // Content quality (naive length check)
  if ((item.contentSnippet || '').length > 200) score += 1.0;
  
  return Math.min(score, 10.0);
}

function extractImage(item: any): string | undefined {
  // 1. Try enclosure
  if (item.enclosure?.url) return item.enclosure.url;
  
  // 2. Try media:content (often an array)
  if (item['media:content']) {
    const media = item['media:content'];
    if (Array.isArray(media) && media.length > 0) return media[0].$.url;
    if (media.$?.url) return media.$.url;
  }
  
  // 3. Try media:thumbnail
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;
  
  // 4. Try to find img in contentEncoded or description
  const content = item.contentEncoded || item.content || item.description || '';
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = imgRegex.exec(content);
  if (match) return match[1];
  
  return undefined;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function getRelativeTime(date: string): string {
  const diff = new Date().getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `Hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
}
