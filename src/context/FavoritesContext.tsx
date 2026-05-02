'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface FavoritesContextType {
  favorites: NewsItem[];
  toggleFavorite: (item: NewsItem) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<NewsItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('auranews_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('auranews_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item: NewsItem) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) {
        return prev.filter(f => f.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
