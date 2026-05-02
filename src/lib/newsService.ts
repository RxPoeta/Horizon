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
  // 1. Geopolítica y Cadenas Globales (Español)
  { name: 'RT Actualidad', url: 'https://actualidad.rt.com/rss', category: 'Mundo' },
  { name: 'Sputnik Latam', url: 'https://sputniknews.lat/export/pool/ee/all.xml', category: 'Mundo' },
  { name: 'CNN en Español', url: 'https://cnnespanol.cnn.com/feed/', category: 'Mundo' },
  
  // 2. Páginas Famosas (Español + Inglés)
  { name: 'BBC Mundo', url: 'https://feeds.bbci.co.uk/mundo/rss.xml', category: 'Mundo' },
  { name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', category: 'Mundo' },
  { name: 'Reuters', url: 'https://www.reutersagency.com/feed/?best-topics=world-news&post_type=best', category: 'Mundo', translate: true },
  { name: 'DW Español', url: 'https://rss.dw.com/rdf/rss-sp-all', category: 'Mundo' },
  
  // 3. Reddit (Inglés + Español)
  { name: 'Reddit WorldNews', url: 'https://www.reddit.com/r/worldnews/top/.rss?t=day', category: 'Mundo', translate: true },
  { name: 'Reddit All', url: 'https://www.reddit.com/r/all/top/.rss?t=day', category: 'Farándula', translate: true },
  { name: 'Reddit ES', url: 'https://www.reddit.com/r/es/top/.rss?t=day', category: 'Cultura' },
  
  // 4. X / Twitter (Vía RSSHub)
  { name: 'X CNN Breaking', url: 'https://rsshub.app/twitter/user/cnnbrk', category: 'Mundo', translate: true },
  { name: 'X Al Jazeera', url: 'https://rsshub.app/twitter/user/AJEnglish', category: 'Mundo', translate: true },
  { name: 'X Elon Musk', url: 'https://rsshub.app/twitter/user/elonmusk', category: 'Tecnología', translate: true }
];

export async function fetchAllNews(): Promise<NewsItem[]> {
  const newsPromises = SOURCES.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.url);
      
      const items = await Promise.all(feed.items.map(async (item, idx) => {
        const score = calculateHorizonScore(item, source.name);
        let title = item.title || 'Sin título';
        let description = item.contentSnippet || item.content || '';

        // Si la fuente requiere traducción y tenemos la API Key
        if (source.translate && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
          try {
            // Traducción rápida de título (solo para los primeros 5 para evitar lentitud)
            if (idx < 5) {
              const translated = await translateToSpanish(title);
              title = translated;
            }
          } catch (e) {
            console.error('Translation error:', e);
          }
        }

        return {
          id: item.guid || `${source.name}-${idx}`,
          title: title,
          description: description,
          link: item.link || '#',
          pubDate: item.pubDate || new Date().toISOString(),
          source: source.name,
          category: source.category,
          imageUrl: extractImage(item),
          score: score,
          author: item.creator || source.name,
          authorInitials: getInitials(item.creator || source.name),
        };
      }));

      return items;
    } catch (error) {
      console.error(`Error fetching ${source.name}:`, error);
      return [];
    }
  });

  const allNews = await Promise.all(newsPromises);
  return allNews.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

async function translateToSpanish(text: string): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Traduce exactamente este título de noticia al español de forma natural: "${text}". Responde solo con la traducción.`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
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
