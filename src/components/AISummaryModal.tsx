'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface AISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  summary: string;
  loading: boolean;
}

export default function AISummaryModal({ isOpen, onClose, title, summary, loading }: AISummaryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant overflow-hidden"
          >
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined text-3xl animate-pulse">auto_awesome</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Aura AI Insight</span>
              </div>
              
              <h2 className="text-xl font-bold leading-tight text-on-surface">
                {title}
              </h2>
              
              <div className="min-h-[120px] flex flex-col justify-center">
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-3 bg-surface-container-high rounded-full w-full animate-pulse" />
                    <div className="h-3 bg-surface-container-high rounded-full w-[90%] animate-pulse" />
                    <div className="h-3 bg-surface-container-high rounded-full w-[95%] animate-pulse" />
                    <div className="h-3 bg-surface-container-high rounded-full w-[80%] animate-pulse" />
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-on-surface-variant font-medium">
                    {summary}
                  </p>
                )}
              </div>
              
              <div className="pt-4 flex justify-between items-center border-t border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Verificado por Aura Engine</span>
                </div>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-primary text-on-primary rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
                >
                  Entendido
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
