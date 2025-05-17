'use client';

import { useState } from 'react';
import { TONE_STYLES, ToneStyleConfig } from '@/constants/toneStyles';
import { ToneStyle } from '@/types';

interface ToneSelectorProps {
  selectedTone: ToneStyle;
  onToneChange: (tone: ToneStyle) => void;
}

export function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  const [previewTone, setPreviewTone] = useState<ToneStyleConfig | null>(
    TONE_STYLES.find((tone) => tone.id === selectedTone) || null
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Choisissez le ton</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {TONE_STYLES.map((tone) => (
          <div
            key={tone.id}
            className={`tone-card p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedTone === tone.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              onToneChange(tone.id);
              setPreviewTone(tone);
            }}
            onMouseEnter={() => setPreviewTone(tone)}
            onMouseLeave={() => 
              setPreviewTone(TONE_STYLES.find((t) => t.id === selectedTone) || null)
            }
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{tone.emoji}</span>
              <h4 className="font-medium">{tone.name}</h4>
            </div>
            <p className="text-xs text-gray-900">{tone.description}</p>
          </div>
        ))}
      </div>

      {previewTone && (
        <div className="mt-6 p-6 rounded-lg shadow-sm overflow-hidden" 
             style={{ 
               backgroundColor: previewTone.backgroundColor,
               color: previewTone.textColor,
               fontFamily: previewTone.fontFamily
             }}>
          <h3 className="text-xl font-bold mb-3">Aperçu du ton</h3>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
            <p>{previewTone.sampleText}</p>
          </div>
        </div>
      )}
    </div>
  );
} 