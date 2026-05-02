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
  link: string;
}


export default function SearchPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedSource, setSelectedSource] = useState('Todas las fuentes');

  const categories = [
    'Todos', 'Mundo', 'Tecnología', 'Economía', 'Ciencia', 
    'Salud', 'Deportes', 'Cultura', 'Sostenibilidad'
  ];

  const trends = [
    '#IAenEducación', '#CrisisClimática', '#SpaceXLaunch', 
    '#MercadosAsia', '#BlockchainEU'
  ];

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setAllNews(data);
        setFilteredNews(data);
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

    if (activeCategory !== 'Todos') {
      result = result.filter(n => n.category === activeCategory);
    }

    if (selectedSource !== 'Todas las fuentes') {
      result = result.filter(n => n.source === selectedSource);
    }

    if (searchQuery) {
      result = result.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(result);
  }, [searchQuery, activeCategory, selectedSource, allNews]);

  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header />
      
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Hub Central de Búsqueda y Filtros */}
        <section className="max-w-screen-2xl mx-auto mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-black text-on-surface mb-1 tracking-tight uppercase">
              Búsqueda a Medida
            </h1>
            <p className="text-body-md text-on-surface-variant opacity-75">
              Explora el ecosistema de información con filtros avanzados
            </p>
          </motion.div>

          {/* Prominent Search Bar */}
          <div className="relative group mb-8 mx-auto max-w-2xl">
            <div className="relative flex items-center bg-surface-container-lowest rounded-full border border-outline-variant shadow-lg p-1.5 pl-5">
              <span className="material-symbols-outlined text-primary text-[22px]">search</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 px-3 py-2 text-sm font-medium placeholder:text-outline outline-none" 
                placeholder="Busca noticias, reportes o temas específicos..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-primary text-on-primary rounded-full px-8 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md">
                BUSCAR
              </button>
            </div>
          </div>

          {/* Filtros Exhaustivos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container-low rounded-2xl border border-outline-variant p-5 md:p-6 space-y-6"
          >
            {/* Categorías */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest block">Categorías</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`${
                      activeCategory === cat 
                        ? 'bg-primary text-on-primary shadow-sm' 
                        : 'bg-white dark:bg-surface-container text-on-surface hover:bg-surface-variant border border-outline-variant'
                    } px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Selectores de Refinamiento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'País', options: ['Cualquier país', 'España', 'México', 'Argentina'], icon: 'expand_more' },
                { label: 'Popularidad / Rating', options: ['Más recientes', 'Más populares', 'Tendencia'], icon: 'star' },
                { 
                  label: 'Fuente RSS / Medio', 
                  options: ['Todas las fuentes', 'Reuters', 'BBC', 'Xataka', 'The Guardian', 'El País'], 
                  icon: 'rss_feed',
                  value: selectedSource,
                  onChange: setSelectedSource
                },
                { label: 'Periodo de tiempo', options: ['Últimas 24 horas', 'Última semana', 'Último mes'], icon: 'calendar_today' },
              ].map((filter) => (
                <div key={filter.label} className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{filter.label}</span>
                  <div className="relative">
                    <select 
                      value={filter.value}
                      onChange={(e) => filter.onChange?.(e.target.value)}
                      className="w-full bg-white dark:bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                    >
                      {filter.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-outline text-[20px]">{filter.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trending Quick Access */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex items-center gap-4 bg-tertiary-container/5 p-4 rounded-xl border border-tertiary-container/10 overflow-hidden"
          >
            <span className="text-tertiary font-bold text-[11px] uppercase tracking-wider whitespace-nowrap flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
              TENDENCIAS:
            </span>
            <div className="flex gap-6 overflow-x-auto no-scrollbar">
              {trends.map(trend => (
                <button 
                  key={trend} 
                  onClick={() => setSearchQuery(trend.replace('#', ''))}
                  className="text-sm text-on-surface-variant hover:text-primary whitespace-nowrap font-medium transition-colors"
                >
                  {trend}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Results Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-outline-variant pb-4">
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">Resultados de búsqueda</h2>
            <span className="text-sm text-on-surface-variant font-medium">
              {loading ? 'Cargando...' : `Mostrando ${filteredNews.length} resultados encontrados`}
            </span>
          </div>
          
          <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
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
          </section>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-slate-200 dark:border-purple-500/30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600" href="/">
          <span className="material-symbols-outlined">trending_up</span>
          <span className="text-[10px] uppercase tracking-widest font-bold">Trends</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary dark:text-primary-fixed-dim" href="/search">
          <span className="material-symbols-outlined">travel_explore</span>
          <span className="text-[10px] uppercase tracking-widest font-bold">Discover</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600" href="/favorites">
          <span className="material-symbols-outlined">bookmark</span>
          <span className="text-[10px] uppercase tracking-widest font-bold">Favoritos</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600" href="/settings">
          <span className="material-symbols-outlined">settings_input_component</span>
          <span className="text-[10px] uppercase tracking-widest font-bold">Settings</span>
        </a>
      </nav>
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
