import { ToneStyle } from '@/types';

export interface ToneStyleConfig {
  id: ToneStyle;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  emoji: string;
  sampleText: string;
}

export const TONE_STYLES: ToneStyleConfig[] = [
  {
    id: 'dramatic',
    name: 'Dramatique',
    description: 'Pour un adieu théâtral et intense',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    fontFamily: 'Georgia, serif',
    emoji: '😭',
    sampleText: 'Les rideaux tombent... Un chapitre se termine, laissant place à un vide immense et incomblable.'
  },
  {
    id: 'ironic',
    name: 'Ironique',
    description: 'Pour dire au revoir avec humour et sarcasme',
    backgroundColor: '#e9e9e9',
    textColor: '#333333',
    fontFamily: 'Comic Sans MS, cursive',
    emoji: '🙃',
    sampleText: 'Eh bien, c\'était... intéressant. Bonne chance avec *insérer n\'importe quelle excuse ici*!'
  },
  {
    id: 'classy',
    name: 'Classe',
    description: 'Pour un adieu élégant et sophistiqué',
    backgroundColor: '#1a1a1a',
    textColor: '#d4af37',
    fontFamily: 'Baskerville, serif',
    emoji: '🥂',
    sampleText: 'Avec gratitude pour le temps partagé, je vous souhaite le meilleur pour vos futurs projets.'
  },
  {
    id: 'cringe',
    name: 'Cringe',
    description: 'Pour un adieu délibérément gênant',
    backgroundColor: '#ff00ff',
    textColor: '#00ff00',
    fontFamily: 'Papyrus, fantasy',
    emoji: '😬',
    sampleText: 'C\'EST FINI !!! *pleure en Comic Sans MS* AU REVOIR POUR TOUJOURS xoxo !!!'
  },
  {
    id: 'touching',
    name: 'Touchant',
    description: 'Pour un adieu sincère et émouvant',
    backgroundColor: '#f5f5f5',
    textColor: '#2c3e50',
    fontFamily: 'Roboto, sans-serif',
    emoji: '💗',
    sampleText: 'Les mots ne suffisent pas pour exprimer ma gratitude. Cette expérience restera à jamais gravée dans mon cœur.'
  },
  {
    id: 'angry',
    name: 'Énervé',
    description: 'Pour exprimer sa frustration en partant',
    backgroundColor: '#8b0000',
    textColor: '#ffffff',
    fontFamily: 'Impact, sans-serif',
    emoji: '🤬',
    sampleText: 'ENFIN LIBRE! Je n\'ai plus à supporter cette situation intenable une seconde de plus!'
  },
  {
    id: 'grateful',
    name: 'Reconnaissant',
    description: 'Pour remercier et apprécier ce qui a été',
    backgroundColor: '#f0f8ff',
    textColor: '#4682b4',
    fontFamily: 'Verdana, sans-serif',
    emoji: '🙏',
    sampleText: 'Merci pour tout ce que vous m\'avez apporté. Je pars enrichi de cette expérience.'
  },
  {
    id: 'professional',
    name: 'Professionnel',
    description: 'Pour un départ formel et respectueux',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontFamily: 'Arial, sans-serif',
    emoji: '🤝',
    sampleText: 'Je vous informe par la présente de mon départ. Je vous remercie pour l\'opportunité professionnelle et vous souhaite une bonne continuation.'
  },
  {
    id: 'funny',
    name: 'Drôle',
    description: 'Pour partir sur une note légère et amusante',
    backgroundColor: '#ffff99',
    textColor: '#663399',
    fontFamily: 'Trebuchet MS, sans-serif',
    emoji: '🤣',
    sampleText: 'Bon, c\'est pas que je m\'ennuie, mais j\'ai un rendez-vous avec ma nouvelle vie! Spoiler: elle est géniale!'
  }
]; 