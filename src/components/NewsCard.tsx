import { useFavorites } from '@/context/FavoritesContext';
import AISummaryModal from './AISummaryModal';
import { useState } from 'react';


interface NewsCardProps {
  id: string;
  category: string;
  time: string;
  title: string;
  description: string;
  author: string;
  authorInitials: string;
  imageUrl?: string;
  score: number;
  link: string;
}


export default function NewsCard({
  id,
  category,
  time,
  title,
  description,
  author,
  authorInitials,
  imageUrl,
  score,
  link,
}: NewsCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const bookmarked = isFavorite(id);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
    if (summary) return;

    setIsSummarizing(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        body: JSON.stringify({ text: description, title }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setSummary('No se pudo generar el resumen en este momento.');
    } finally {
      setIsSummarizing(false);
    }
  };



  // Score color logic
  const getScoreColor = (s: number) => {
    if (s >= 8) return 'text-green-500';
    if (s >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <article 
      onClick={() => window.open(link, '_blank')}
      className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-outline-variant flex flex-col h-full relative"
    >
      {/* AI Score Badge (Horizon Style) */}
      <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md border border-outline-variant shadow-sm flex items-center gap-1`}>
        <span className="text-[8px] font-black uppercase opacity-60">Score</span>
        <span className={`text-[10px] font-bold ${getScoreColor(score || 0)}`}>{(score || 0).toFixed(1)}</span>
      </div>

      <div className="aspect-[16/10] overflow-hidden bg-surface-container flex items-center justify-center">
        {imageUrl ? (
          <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            src={imageUrl} 
            alt={title}
          />
        ) : (
          <span className="material-symbols-outlined text-outline text-3xl opacity-30">public</span>
        )}
      </div>

      <div className="p-2.5 flex flex-col flex-1 gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase text-primary tracking-wider">{category}</span>
          <span className="text-[9px] text-outline font-medium">{time}</span>
        </div>

        <h3 className="font-bold text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.4rem]">
          {title}
        </h3>

        <p className="text-[10px] text-on-surface-variant line-clamp-2 leading-relaxed opacity-85">
          {description}
        </p>

        <div className="mt-auto pt-2 flex items-center justify-between border-t border-outline-variant/30">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-primary-container flex items-center justify-center text-[7px] font-black text-on-primary-container">
              {authorInitials}
            </div>
            <span className="text-[9px] text-outline font-medium truncate max-w-[80px]">{author}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSummarize}
              className="text-outline-variant hover:text-primary transition-colors"
              title="Resumen IA"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite({ id, category, time, title, description, author, authorInitials, imageUrl, score, source: '', link });
              }}
              className={`transition-colors ${bookmarked ? 'text-primary' : 'text-outline-variant hover:text-primary'}`}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}>
                bookmark
              </span>
            </button>
          </div>

          <AISummaryModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={title}
            summary={summary}
            loading={isSummarizing}
          />


        </div>
      </div>
    </article>
  );
}
