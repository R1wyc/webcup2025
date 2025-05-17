'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useVote } from '@/context/VoteContext';
import { getEndPageById } from '@/services/endpageService';
import { EndPage } from '@/types';
import { TrophyIcon, FireIcon } from '@heroicons/react/24/solid';
import VoteButtons from './VoteButtons';

interface HallOfFameProps {
  className?: string;
  maxDisplay?: number;
}

export default function HallOfFame({ className = '', maxDisplay = 5 }: HallOfFameProps) {
  const { hallOfFamePageIds, refreshHallOfFame, getScore } = useVote();
  const [famePages, setFamePages] = useState<EndPage[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize the fetchFamePages function to prevent it from changing on every render
  const fetchFamePages = useCallback(async () => {
    setLoading(true);
    
    try {
      // Fetch page details for each ID in the hall of fame
      const pagesPromises = hallOfFamePageIds.map(id => getEndPageById(id));
      const pagesResults = await Promise.all(pagesPromises);
      
      // Filter out null results and sort by score descending
      const validPages = pagesResults
        .filter((page): page is EndPage => page !== null)
        .sort((a, b) => getScore(b.id) - getScore(a.id))
        .slice(0, maxDisplay);
      
      setFamePages(validPages);
    } catch (error) {
      console.error('Error fetching hall of fame pages:', error);
    } finally {
      setLoading(false);
    }
  }, [hallOfFamePageIds, maxDisplay, getScore]);

  // Effect to load fame pages when hall of fame IDs change
  useEffect(() => {
    if (hallOfFamePageIds.length > 0) {
      fetchFamePages();
    } else {
      setFamePages([]);
      setLoading(false);
    }
  }, [hallOfFamePageIds, fetchFamePages]);

  // Refresh hall of fame on mount, but only once
  useEffect(() => {
    refreshHallOfFame();
    // We intentionally don't include refreshHallOfFame in the dependency array
    // to prevent infinite loops - this should only run once on mount
  }, []);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (famePages.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
        <h2 className="text-2xl font-bold flex items-center mb-4 text-gray-900 dark:text-white">
          <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
          Hall of Fame
        </h2>
        <p className="text-gray-800 dark:text-gray-200">
          Aucune page n'a encore atteint notre Hall of Fame. Votez pour vos pages préférées !
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold flex items-center mb-6 text-gray-900 dark:text-white">
        <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
        Hall of Fame
      </h2>

      <div className="space-y-6">
        {famePages.map(page => (
          <div key={page.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <Link 
                href={`/${page.slug}`} 
                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {page.title}
              </Link>
              <div className="flex items-center space-x-2">
                <FireIcon className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-orange-500">{getScore(page.id)}</span>
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-sm line-clamp-2 mb-2">{page.content}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-700 dark:text-gray-400">
                {new Date(page.createdAt).toLocaleDateString()}
              </span>
              <VoteButtons pageId={page.id} showScore={false} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 