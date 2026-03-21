
export enum PhonemeType {
  CONSONANT = 'CONSONANT',
  VOWEL = 'VOWEL',
  DIPHTHONG = 'DIPHTHONG',
  SPECIAL = 'SPECIAL',
}

export enum PracticeMode {
  PHONEME = 'PHONEME',
  MINIMAL_PAIRS = 'MINIMAL_PAIRS',
  SENTENCES = 'SENTENCES',
}

export interface MinimalPair {
  word1: string;
  word2: string;
  targetIpa: string;
  comparisonIpa: string;
}

export interface PhonemeInfo {
  id: string;
  ipa: string;
  exampleWords: string[];
  type: PhonemeType;
  description: string;
  tips: string;
  commonMistakes: string;
  animationState: 'neutral' | 'open' | 'tongue-out' | 'tongue-up' | 'rounded';
  minimalPairs?: MinimalPair[];
  sentences?: string[];
}

export interface TranscriptionItem {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface UserProgress {
  points: number;
  level: number;
  streak: number;
  lastPracticeDate: string | null;
  badges: string[]; // IDs of earned badges
  sessionsCount: number;
}

export interface LeaderboardEntry {
  name: string;
  points: number;
  isCurrentUser?: boolean;
}
