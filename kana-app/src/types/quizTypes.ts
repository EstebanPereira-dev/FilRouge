import type { Kana } from '../data/kana';

export interface QuizConfig {
    questionCount: number | 'all';
    mode: 'normal' | 'inverse';
    timerSeconds: number | null;
    selectedRows: string[];
}

export interface QuizResult {
    kana: Kana;
    userAnswer: string;
    correct: boolean;
}

export interface QuizSession {
    id: string;
    date: string;
    score: number;
    total: number;
    results: QuizResult[];
    mode: 'normal' | 'inverse';
}

export const DEFAULT_CONFIG: QuizConfig = {
    questionCount: 10,
    mode: 'normal',
    timerSeconds: null,
    selectedRows: [],
};

export function getRow(romanji: string): string {
    if (['a', 'i', 'u', 'e', 'o'].includes(romanji)) return 'voyelles';
    if (romanji === 'n') return 'n';
    return romanji[0];
}

export function getAvailableRows(kanaData: Kana[]): string[] {
    return Array.from(new Set(kanaData.map(k => getRow(k.romanji))));
}