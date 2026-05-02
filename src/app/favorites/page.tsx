'use client';

import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { motion } from 'framer-motion';
import { useFavorites } from '@/context/FavoritesContext';
import { useState } from 'react';


export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFavorites = favorites.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const collections = [
    { name: 'Noticias de Enero', items: 24, icon: 'news', color: 'bg-primary-container/10 text-primary' },
    { name: 'Top Mensual', items: 12, icon: 'military_tech', color: 'bg-tertiary-container/10 text-tertiary' },
    { name: 'Seguimiento Crisis IA', items: 45, icon: 'psychology', color: 'bg-secondary-container/10 text-secondary' },
    { name: 'Futurismo & Tech', items: 8, icon: 'auto_awesome', color: 'bg-error-container/10 text-error' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header />
      
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-10">
        {/* Hero Search Section */}
        <section className="max-w-2xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-black text-on-surface mb-1 tracking-tight uppercase">Tus Favoritos</h1>
            <p className="text-body-md text-on-surface-variant opacity-75">Busca entre tus artículos guardados y colecciones personalizadas.</p>
          </motion.div>
          <div className="relative group max-w-xl mx-auto">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container border-none rounded-full shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium outline-none" 
              placeholder="Buscar en mis guardados..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>


        {/* Collections Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder_special</span>
              Colecciones
            </h2>
            <div className="flex gap-4">
              <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary text-[10px] font-bold uppercase tracking-widest transition-colors">
                AJUSTES <span className="material-symbols-outlined text-[16px]">settings</span>
              </button>
              <button className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-widest hover:underline transition-colors">
                NUEVA COLECCIÓN <span className="material-symbols-outlined text-[16px]">add_circle</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((col, i) => (
              <motion.div 
                key={col.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group cursor-pointer bg-white dark:bg-surface-container-low p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-outline-variant/30 hover:border-primary/30"
              >
                <div className={`w-14 h-14 mb-3 ${col.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-3xl">{col.icon}</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-0.5">{col.name}</h3>
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">{col.items} ELEMENTOS</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button className="px-6 py-2 border-2 border-primary text-primary text-xs font-bold rounded-full hover:bg-primary hover:text-on-primary transition-all">
              Ver más
            </button>
          </div>
        </section>

        {/* Recent Saves Feed */}
        <section className="space-y-4 pb-20">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Guardados Recientemente
            </h2>
            <div className="flex items-center bg-surface-container rounded-lg p-1 gap-1">
              <button className="p-1.5 bg-white dark:bg-surface-container-high shadow-sm rounded-md text-primary">
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">view_list</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredFavorites.length > 0 ? (
              filteredFavorites.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <NewsCard 
                    id={item.id}
                    title={item.title}
                    category={item.category}
                    description={item.description}
                    imageUrl={item.imageUrl}
                    time={item.pubDate}
                    score={item.score}
                    author={item.author}
                    authorInitials={item.authorInitials}
                    link={item.link}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <span className="material-symbols-outlined text-6xl text-outline opacity-20">bookmark_border</span>
                <p className="text-on-surface-variant font-medium">No tienes noticias guardadas todavía.</p>
                <a href="/" className="inline-block px-6 py-2 bg-primary text-on-primary rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                  Explorar Noticias
                </a>
              </div>
            )}
          </div>

        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-slate-200 dark:border-purple-500/30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600" href="/">
          <span className="material-symbols-outlined">trending_up</span>
          <span className="text-[10px] uppercase tracking-widest font-bold">Trends</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600" href="/search">
          <span className="material-symbols-outlined">travel_explore</span>
          <span className="text-[10px] uppercase tracking-widest font-bold">Discover</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary dark:text-primary-fixed-dim" href="/favorites">
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
