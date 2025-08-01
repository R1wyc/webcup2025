'use client';

import { EndPage } from '@/types';
import { TONE_STYLES } from '@/constants/toneStyles';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { ShareIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import VoteButtons from '@/components/vote/VoteButtons';
import { useVote } from '@/context/VoteContext';
import { useAuth } from '@/context/AuthContext';

interface EndPageViewProps {
  endPage: EndPage;
  onShare?: () => void;
}

export function EndPageView({ endPage, onShare }: EndPageViewProps) {
  const [copied, setCopied] = useState(false);
  const { isInHallOfFame } = useVote();
  const { user } = useAuth();
  
  // Memoize tone style lookup to prevent unnecessary recalculations
  const toneStyle = useMemo(() => {
    return TONE_STYLES.find((tone) => tone.id === endPage.tone) || TONE_STYLES[0];
  }, [endPage.tone]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Memoize media rendering to prevent unnecessary rerenders
  const renderMedia = useMemo(() => {
    const media = endPage.media;
    if (!media || media.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-8 space-y-6">
        {media.map((item, index) => {
          switch (item.type) {
            case 'image':
            case 'gif':
              return (
                <div key={index} className="relative rounded-lg overflow-hidden h-64 w-full mx-auto">
                  <Image
                    src={item.url}
                    alt={item.title || 'Image'}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              );
            case 'youtube':
              return (
                <div key={index} className="aspect-video w-full max-w-2xl mx-auto">
                  <ReactPlayer
                    url={item.url}
                    width="100%"
                    height="100%"
                    controls
                  />
                </div>
              );
            case 'music':
              return (
                <div key={index} className="w-full max-w-md mx-auto">
                  <div className="p-4 rounded-lg bg-opacity-50 backdrop-blur-sm flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.title || 'Musique'}
                      </p>
                    </div>
                    <audio
                      controls
                      className="w-full"
                      src={item.url}
                    />
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }, [endPage.media]);
  
  // Memoize the Hall of Fame check to prevent unnecessary calculations
  const isPageInHallOfFame = useMemo(() => {
    return isInHallOfFame(endPage.id);
  }, [isInHallOfFame, endPage.id]);
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: endPage.backgroundColor || toneStyle.backgroundColor,
        color: endPage.textColor || toneStyle.textColor,
        fontFamily: endPage.fontFamily || toneStyle.fontFamily,
      }}
    >
      <header className="p-4 flex justify-between items-center">
        {isPageInHallOfFame && (
          <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-yellow-300 text-xl mr-1">🏆</span>
            <span className="text-sm font-semibold">Hall of Fame</span>
          </div>
        )}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={onShare || handleCopyLink}
            className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
          >
            <ShareIcon className="h-4 w-4 mr-2" />
            {copied ? 'Lien copié!' : 'Partager'}
          </Button>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 md:p-12">
        <div className="max-w-3xl w-full backdrop-blur-sm bg-white/10 p-6 sm:p-8 md:p-12 rounded-lg shadow-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center">
            {endPage.title}
          </h1>
          
          <div className="my-8">
            <div className="whitespace-pre-wrap text-lg sm:text-xl leading-relaxed">
              {endPage.content}
            </div>
          </div>
          
          {renderMedia}
          
          <div className="mt-10 flex justify-center">
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <p className="text-center mb-3 font-medium">
                {user ? 'Que pensez-vous de cette page ?' : 'Connectez-vous pour voter'}
              </p>
              <VoteButtons pageId={endPage.id} className="justify-center" />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm opacity-70">
        Créé avec TheEnd.page
      </footer>
    </div>
  );
} 