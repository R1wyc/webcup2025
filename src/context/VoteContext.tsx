'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  VoteValue, 
  loadVotes, 
  saveVotes, 
  getUserVote, 
  addVote, 
  getPageScore,
  getHallOfFamePageIds
} from '@/services/voteService';

interface VoteContextType {
  // Vote functionality
  voteForPage: (pageId: string, voteValue: VoteValue) => void;
  getUserVoteForPage: (pageId: string) => VoteValue | null;
  getScore: (pageId: string) => number;
  
  // Hall of Fame
  hallOfFamePageIds: string[];
  refreshHallOfFame: () => void;
  isInHallOfFame: (pageId: string) => boolean;

  // Loading state
  isLoading: boolean;
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export function VoteProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [votes, setVotes] = useState<ReturnType<typeof loadVotes>>({});
  const [hallOfFamePageIds, setHallOfFamePageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load votes and initialize hall of fame only once on mount
  useEffect(() => {
    const initialVotes = loadVotes();
    setVotes(initialVotes);
    
    const fameIds = getHallOfFamePageIds();
    setHallOfFamePageIds(fameIds);
    
    setIsLoading(false);
  }, []);

  // Memoize functions that are passed as context values to prevent unnecessary rerenders
  const refreshHallOfFame = useCallback(() => {
    const fameIds = getHallOfFamePageIds();
    setHallOfFamePageIds(fameIds);
  }, []);

  const isInHallOfFame = useCallback((pageId: string) => {
    return hallOfFamePageIds.includes(pageId);
  }, [hallOfFamePageIds]);

  const voteForPage = useCallback((pageId: string, voteValue: VoteValue) => {
    if (!user) {
      throw new Error('User must be logged in to vote');
    }

    // Add the vote
    addVote(pageId, user.uid, voteValue);
    
    // Update local state
    setVotes(loadVotes());
    
    // Refresh Hall of Fame in case this vote changed its status
    refreshHallOfFame();
  }, [user, refreshHallOfFame]);

  const getUserVoteForPage = useCallback((pageId: string) => {
    if (!user) return null;
    return getUserVote(pageId, user.uid);
  }, [user]);

  const getScore = useCallback((pageId: string) => {
    return getPageScore(pageId);
  }, []);

  const contextValue = {
    voteForPage,
    getUserVoteForPage,
    getScore,
    hallOfFamePageIds,
    refreshHallOfFame,
    isInHallOfFame,
    isLoading
  };

  return (
    <VoteContext.Provider value={contextValue}>
      {children}
    </VoteContext.Provider>
  );
}

export function useVote() {
  const context = useContext(VoteContext);
  if (context === undefined) {
    throw new Error('useVote must be used within a VoteProvider');
  }
  return context;
} 