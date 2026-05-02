'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Perfil');
  const [isSaved, setIsSaved] = useState(false);

  const menuItems = [
    { name: 'Perfil', icon: 'person' },
    { name: 'Notificaciones', icon: 'notifications' },
    { name: 'Privacidad y Seguridad', icon: 'security' },
    { name: 'Apariencia', icon: 'brush' },
    { name: 'Cerrar Sesión', icon: 'logout', error: true },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header />
      
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8">
        <section className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-black text-on-surface mb-1 tracking-tight uppercase">Ajustes</h1>
            <p className="text-body-md text-on-surface-variant opacity-75">Personaliza tu experiencia en AuraNews AI.</p>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar Navigation */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button 
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  activeTab === item.name 
                    ? 'bg-primary-container/10 text-primary shadow-sm' 
                    : item.error
                      ? 'text-error hover:bg-error-container/10'
                      : 'text-on-surface hover:bg-surface-container transition-colors'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8 pb-20">
            {activeTab === 'Perfil' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">Información del Perfil</h2>
                  {isSaved && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-widest"
                    >
                      ¡Guardado!
                    </motion.span>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container text-2xl font-bold shadow-lg">
                      JD
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-on-primary rounded-full shadow-md border-2 border-white dark:border-black hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-lg text-on-surface">John Doe</p>
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded inline-block">PLAN PREMIUM</p>
                  </div>
                </div>
                <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="name">NOMBRE</label>
                    <input className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container/30 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" id="name" type="text" defaultValue="John Doe"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="email">EMAIL</label>
                    <input className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container/30 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" id="email" type="email" defaultValue="john.doe@example.com"/>
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="bio">BIOGRAFÍA</label>
                    <textarea className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container/30 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none" id="bio" rows={3} defaultValue="Entusiasta de la inteligencia artificial y lector de noticias tecnológicas." />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                    <button className="px-6 py-2 text-primary font-bold hover:bg-primary/5 transition-colors rounded-full text-sm" type="button">Cancelar</button>
                    <button className="px-8 py-2 bg-primary text-on-primary font-bold rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm" type="submit">Guardar Cambios</button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab !== 'Perfil' && activeTab !== 'Cerrar Sesión' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface-container-lowest p-12 rounded-2xl shadow-sm border border-outline-variant/30 text-center space-y-4"
              >
                <span className="material-symbols-outlined text-6xl text-outline opacity-20">construction</span>
                <h2 className="text-xl font-bold text-on-surface">Sección en desarrollo</h2>
                <p className="text-on-surface-variant text-sm">Estamos trabajando para traerte los mejores ajustes de {activeTab}.</p>
              </motion.div>
            )}

            {/* Preferences */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30 space-y-6"
            >
              <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">Preferencias de Contenido</h2>
              <div className="space-y-3">
                {[
                  { title: 'Resúmenes con IA', desc: 'Generar automáticamente puntos clave para cada noticia.', checked: true },
                  { title: 'Modo Lectura Inmersivo', desc: 'Ocultar distracciones al leer artículos largos.', checked: false },
                ].map((pref) => (
                  <div key={pref.title} className="flex items-center justify-between p-4 bg-surface dark:bg-surface-container-low rounded-2xl border border-outline-variant/30 hover:border-primary/20 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm text-on-surface">{pref.title}</p>
                      <p className="text-on-surface-variant text-[11px] leading-relaxed">{pref.desc}</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked={pref.checked} className="sr-only peer" type="checkbox" />
                      <div className="w-10 h-5.5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
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
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600" href="/favorites">
          <span className="material-symbols-outlined">bookmark</span>
          <span className="text-[10px] uppercase tracking-widest font-bold">Favoritos</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary dark:text-primary-fixed-dim" href="/settings">
          <span className="material-symbols-outlined">settings_input_component</span>
          <span className="text-[10px] uppercase tracking-widest font-bold">Settings</span>
        </a>
      </nav>
    </div>
  );
}
