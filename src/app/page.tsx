'use client';

import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  category: string;
  pubDate: string;
  title: string;
  description: string;
  author: string;
  authorInitials: string;
  score: number;
  imageUrl?: string;
  source: string;
}


const CATEGORIES = [
  'Mundo', 'Política', 'Tecnología', 'Economía', 'Farándula', 
  'Deportes', 'Salud', 'Ciencia', 'Cultura', 'Estilo de Vida'
];

const MOCK_NEWS = [
  {
    category: 'Mundo',
    time: 'Hace 2m',
    title: 'Computación cuántica redefine mercados',
    description: 'Algoritmos procesan datos en milisegundos creando ventajas estratégicas.',
    author: 'J. Domínguez',
    authorInitials: 'JD',
    score: 9.8,
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop'
  },
  {
    category: 'Tecnología',
    time: 'Hace 15m',
    title: 'Chips Bio-orgánicos: El futuro del hardware',
    description: 'Integración de componentes orgánicos en microprocesadores de silicio.',
    author: 'Marina Soler',
    authorInitials: 'MS',
    score: 8.5,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop'
  },
  {
    category: 'Economía',
    time: 'Hace 1h',
    title: 'Impacto de inflación digital en Asia',
    description: 'Análisis sobre criptodivisas estabilizando economías locales en conflicto.',
    author: 'J. Domínguez',
    authorInitials: 'JD',
    score: 7.2,
    imageUrl: 'https://images.unsplash.com/photo-1611974714024-1a9499896321?q=80&w=400&auto=format&fit=crop'
  },
  {
    category: 'Ciencia',
    time: 'Hace 3h',
    title: 'Robótica blanda para misiones de rescate',
    description: 'Nuevos materiales permiten a robots navegar espacios críticos e inundados.',
    author: 'F. Vera',
    authorInitials: 'FV',
    score: 9.1,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400&auto=format&fit=crop'
  },
  {
    category: 'Salud',
    time: 'Hace 5h',
    title: 'Vacunas ARN de nueva generación personalizadas',
    description: 'Avance histórico en la inmunización específica contra tipos de cáncer raros.',
    author: 'R. Peña',
    authorInitials: 'RP',
    score: 9.5,
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=400&auto=format&fit=crop'
  },
  // Extra items to fill the grid
  ...Array(10).fill(null).map((_, i) => ({
    category: CATEGORIES[i % CATEGORIES.length],
    time: `Hace ${i + 6}h`,
    title: `Noticia relevante número ${i + 6} de la semana`,
    description: 'Descripción breve de la noticia para completar el bento grid con datos simulados.',
    author: 'AuraNews Team',
    authorInitials: 'AT',
    score: 6 + Math.random() * 3,
  }))
];

export default function Home() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Explorar');
  const [topFilter, setTopFilter] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setAllNews(data);
        setFilteredNews(data.slice(0, topFilter));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  useEffect(() => {
    let result = [...allNews];

    if (activeCategory !== 'Explorar') {
      result = result.filter(n => n.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply Top N limit
    result = result.slice(0, topFilter);

    setFilteredNews(result);
  }, [activeCategory, searchQuery, topFilter, allNews]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 w-full flex-1 py-2 sm:py-4">
        {/* Compact Hero Section */}
        <section className="mb-4 sm:mb-6 text-center pt-2 sm:pt-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-primary via-primary-container to-[#311b92] bg-clip-text text-transparent dark:from-primary-fixed-dim dark:to-secondary-fixed uppercase leading-none mb-2 font-sans"
            style={{ textShadow: '0 4px 10px rgba(79, 55, 138, 0.1)' }}
          >
            AURANEWS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant max-w-lg mx-auto text-[10px] sm:text-xs md:text-sm leading-tight"
          >
            Información seleccionada en tiempo real impulsada por procesamiento de alta velocidad. 
            Explorando la intersección de cambios globales y evolución tecnológica.
          </motion.p>
        </section>

        {/* Compact Filter Bar */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 mb-6 flex flex-col gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest mr-1">Categorías:</span>
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => setActiveCategory('Explorar')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-sm ${
                  activeCategory === 'Explorar' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'
                }`}
              >
                Explorar
              </button>
              {CATEGORIES.slice(0, 6).map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                    activeCategory === cat ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant hover:bg-outline-variant'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button className="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold hover:bg-outline-variant transition-all">
                + más
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/30 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Filtros:</span>
              <select 
                value={topFilter}
                onChange={(e) => setTopFilter(Number(e.target.value))}
                className="bg-surface-container text-[10px] font-bold px-2 py-1 rounded border border-outline-variant outline-none cursor-pointer"
              >
                <option value={3}>Top 3</option>
                <option value={5}>Top 5</option>
                <option value={15}>Top 15</option>
                <option value={50}>Top 50</option>
              </select>
              <select className="bg-surface-container text-[10px] font-bold px-2 py-1 rounded border border-outline-variant outline-none cursor-pointer">
                <option>Global</option>
                <option>Local</option>
              </select>
            </div>
            
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-sm text-outline">search</span>
              <input 
                type="text" 
                placeholder="Buscar noticias..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container text-[10px] pl-7 pr-3 py-1 rounded-full border border-outline-variant focus:ring-1 focus:ring-primary outline-none w-40 sm:w-60"
              />
            </div>
          </div>
        </div>

        {/* Dense Bento Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 pb-12">
          {loading ? (
             Array(10).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-surface-container animate-pulse rounded-xl" />
            ))
          ) : (
            filteredNews.map((news, idx) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <NewsCard 
                  id={news.id}
                  category={news.category}
                  time={getRelativeTime(news.pubDate)}
                  title={news.title}
                  description={news.description}
                  author={news.author}
                  authorInitials={news.authorInitials}
                  score={news.score}
                  imageUrl={news.imageUrl}
                  link={news.link}
                />

              </motion.div>
            ))
          )}
          {!loading && filteredNews.length === 0 && (
            <div className="col-span-full py-20 text-center text-outline text-sm">
              No se encontraron noticias en esta categoría.
            </div>
          )}
        </div>
      </main>

      {/* Background Decor - More subtle */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed-dim blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-secondary-container blur-[80px]"></div>
      </div>
    </div>
  );
}

function getRelativeTime(date: string): string {
  const diff = new Date().getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `Hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
}

