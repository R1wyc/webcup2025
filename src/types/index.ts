export type ToneStyle = 
  | 'dramatic'
  | 'ironic'
  | 'classy'
  | 'cringe'
  | 'touching'
  | 'angry'
  | 'grateful'
  | 'professional'
  | 'funny';

export interface MediaItem {
  type: 'image' | 'gif' | 'youtube' | 'music';
  url: string;
  title?: string;
}

export interface EndPage {
  id: string;
  title: string;
  content: string;
  tone: ToneStyle;
  media: MediaItem[];
  isPublic: boolean;
  createdAt: number;
  userId: string;
  slug: string;
  backgroundColor?: string;
  fontFamily?: string;
  textColor?: string;
  isDraft?: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
} 