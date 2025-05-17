'use client';

import { useState, useEffect } from 'react';
import HallOfFame from '@/components/vote/HallOfFame';
import { useVote } from '@/context/VoteContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TrophyIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function HallOfFamePage() {
  const { refreshHallOfFame, hallOfFamePageIds } = useVote();
  const [loading, setLoading] = useState(true);

  // Only refresh hall of fame once when component mounts
  useEffect(() => {
    refreshHallOfFame();
    setLoading(false);
    // We intentionally don't include refreshHallOfFame in the dependency array
    // to prevent infinite loops - this should only run once on mount
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3" />
            Hall of Fame
          </h1>
          <Button
            as={Link}
            href="/"
            variant="outline"
            size="sm"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Qu'est-ce que le Hall of Fame?</h2>
          <p className="text-gray-800 dark:text-gray-200">
            Le Hall of Fame regroupe les pages les plus appréciées par notre communauté. 
            Pour qu'une page y figure, elle doit obtenir un score supérieur à 10 votes positifs.
            Vous pouvez contribuer en votant pour vos pages préférées !
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : hallOfFamePageIds.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-300">
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
              <TrophyIcon className="h-12 w-12 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aucune page dans le Hall of Fame</h2>
            <p className="text-gray-800 dark:text-gray-200 max-w-md mx-auto mb-6">
              Il n'y a pas encore de pages avec un score supérieur à 10. Explorez les pages existantes et votez pour vos préférées !
            </p>
            <Button as={Link} href="/explore" variant="primary">
              Explorer les pages
            </Button>
          </div>
        ) : (
          <HallOfFame maxDisplay={50} />
        )}
      </div>
    </div>
  );
} 