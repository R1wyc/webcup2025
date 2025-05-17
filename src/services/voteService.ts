import { User } from '@/types';

// Vote type: 1 for upvote, -1 for downvote
export type VoteValue = 1 | -1;

// Structure for votes in localStorage
export interface VoteStore {
  [pageId: string]: {
    [userId: string]: VoteValue;
  };
}

// Key for localStorage
const VOTES_STORAGE_KEY = 'votes';

// Load votes from localStorage
export const loadVotes = (): VoteStore => {
  if (typeof window === 'undefined') return {};
  
  try {
    const storedVotes = localStorage.getItem(VOTES_STORAGE_KEY);
    if (storedVotes) {
      return JSON.parse(storedVotes) as VoteStore;
    }
  } catch (error) {
    console.error('Error loading votes:', error);
  }
  
  return {};
};

// Save votes to localStorage
export const saveVotes = (votes: VoteStore): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  } catch (error) {
    console.error('Error saving votes:', error);
  }
};

// Get current vote by a user for a page
export const getUserVote = (pageId: string, userId: string): VoteValue | null => {
  const votes = loadVotes();
  
  if (votes[pageId] && votes[pageId][userId] !== undefined) {
    return votes[pageId][userId];
  }
  
  return null;
};

// Register a vote
export const addVote = (pageId: string, userId: string, voteValue: VoteValue): void => {
  const votes = loadVotes();
  
  // Initialize page votes object if it doesn't exist
  if (!votes[pageId]) {
    votes[pageId] = {};
  }
  
  // Add or update user's vote
  votes[pageId][userId] = voteValue;
  
  // Save votes
  saveVotes(votes);
};

// Calculate total score for a page
export const getPageScore = (pageId: string): number => {
  const votes = loadVotes();
  
  if (!votes[pageId]) {
    return 0;
  }
  
  // Sum all votes for this page
  return Object.values(votes[pageId]).reduce((total, vote) => total + vote, 0);
};

// Get all votes for a page
export const getPageVotes = (pageId: string): { [userId: string]: VoteValue } => {
  const votes = loadVotes();
  return votes[pageId] || {};
};

// Check if a page is in the Hall of Fame (score > 10)
export const isInHallOfFame = (pageId: string): boolean => {
  return getPageScore(pageId) > 10;
};

// Get all pages that are in the Hall of Fame
export const getHallOfFamePageIds = (): string[] => {
  const votes = loadVotes();
  
  return Object.keys(votes).filter(pageId => {
    const score = Object.values(votes[pageId]).reduce((total, vote) => total + vote, 0);
    return score > 10;
  });
}; 