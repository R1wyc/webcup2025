'use client';

import { useState, useEffect, useCallback } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import { useVote } from '@/context/VoteContext';
import { useAuth } from '@/context/AuthContext';
import { VoteValue } from '@/services/voteService';

interface VoteButtonsProps {
  pageId: string;
  showScore?: boolean;
  className?: string;
}

export default function VoteButtons({ pageId, showScore = true, className = '' }: VoteButtonsProps) {
  const { voteForPage, getUserVoteForPage, getScore } = useVote();
  const { user } = useAuth();
  const [userVote, setUserVote] = useState<VoteValue | null>(null);
  const [score, setScore] = useState(0);
  const [animateUpvote, setAnimateUpvote] = useState(false);
  const [animateDownvote, setAnimateDownvote] = useState(false);

  // Create a stable function to update score and vote state
  const updateStateFromProps = useCallback(() => {
    if (user && pageId) {
      const currentVote = getUserVoteForPage(pageId);
      const currentScore = getScore(pageId);
      
      setUserVote(currentVote);
      setScore(currentScore);
    }
  }, [user, pageId, getUserVoteForPage, getScore]);

  // Update state when user or pageId changes
  useEffect(() => {
    updateStateFromProps();
  }, [updateStateFromProps]);

  const handleVote = useCallback((voteValue: VoteValue) => {
    if (!user) {
      // Could show a toast or alert here
      alert('Vous devez être connecté pour voter');
      return;
    }

    // Animate the appropriate button
    if (voteValue === 1) {
      setAnimateUpvote(true);
      setTimeout(() => setAnimateUpvote(false), 500);
    } else {
      setAnimateDownvote(true);
      setTimeout(() => setAnimateDownvote(false), 500);
    }

    try {
      voteForPage(pageId, voteValue);
      
      // Update local state
      setUserVote(voteValue);
      setScore(getScore(pageId));
    } catch (error) {
      console.error('Error voting:', error);
    }
  }, [user, pageId, voteForPage, getScore]);

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <button
        onClick={() => handleVote(1)}
        className={`transition-transform ${animateUpvote ? 'scale-125' : ''} focus:outline-none`}
        aria-label="Vote positif"
        type="button"
      >
        {userVote === 1 ? (
          <HandThumbUpSolid className="h-6 w-6 text-green-500" />
        ) : (
          <HandThumbUpIcon className="h-6 w-6 text-gray-500 hover:text-green-500" />
        )}
      </button>

      {showScore && (
        <span 
          className={`font-medium ${
            score > 0 
              ? 'text-green-600' 
              : score < 0 
              ? 'text-red-600' 
              : 'text-gray-600'
          }`}
        >
          {score}
        </span>
      )}

      <button
        onClick={() => handleVote(-1)}
        className={`transition-transform ${animateDownvote ? 'scale-125' : ''} focus:outline-none`}
        aria-label="Vote négatif"
        type="button"
      >
        {userVote === -1 ? (
          <HandThumbDownSolid className="h-6 w-6 text-red-500" />
        ) : (
          <HandThumbDownIcon className="h-6 w-6 text-gray-500 hover:text-red-500" />
        )}
      </button>
    </div>
  );
} 