import { useLocalStorage } from './useLocalStorage';
import type { QuizSession } from '../types/quizTypes';
import type { Kana } from '../data/kana';

export interface CharacterStat {
    kana: Kana;
    attempts: number;
    errors: number;
    errorRate: number;
}

export function useStats() {
    const [sessions, setSessions] = useLocalStorage<QuizSession[]>('kana-sessions', []);
    const [bestScore, setBestScore] = useLocalStorage<number>('kana-best-score', 0);

    const saveSession = (session: QuizSession) => {
        setSessions(prev => [session, ...prev].slice(0, 20));
        if (session.score > bestScore) setBestScore(session.score);
    };

    const hardestCharacters: CharacterStat[] = (() => {
        const map = new Map<string, CharacterStat>();
        for (const session of sessions) {
            for (const result of session.results) {
                const key = result.kana.romanji;
                const entry = map.get(key) ?? { kana: result.kana, attempts: 0, errors: 0, errorRate: 0 };
                entry.attempts++;
                if (!result.correct) entry.errors++;
                entry.errorRate = entry.errors / entry.attempts;
                map.set(key, entry);
            }
        }
        return Array.from(map.values())
            .filter(s => s.attempts >= 2)
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 10);
    })();

    const averageScore = sessions.length > 0
        ? Math.round(sessions.reduce((sum, s) => sum + (s.score / s.total) * 100, 0) / sessions.length)
        : 0;

    return { sessions, saveSession, bestScore, hardestCharacters, totalSessions: sessions.length, averageScore };
}