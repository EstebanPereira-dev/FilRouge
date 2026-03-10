import { useState, useEffect, useRef } from 'react';
import type { Kana } from '../data/kana';
import type { QuizConfig, QuizResult } from '../types/quizTypes';
import { getRow } from '../types/quizTypes';

export type Phase = 'config' | 'playing' | 'summary';

export interface UseQuizReturn {
    phase: Phase;
    startQuiz: (config: QuizConfig) => void;
    restartQuiz: () => void;
    displayChar: string;
    userAnswer: string;
    currentIndex: number;
    totalQuestions: number;
    score: number;
    feedback: string;
    timeLeft: number | null;
    choices: Kana[];
    mode: 'normal' | 'inverse';
    setUserAnswer: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleChoice: (kana: Kana) => void;
    results: QuizResult[];
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

function generateChoices(correct: Kana, allKana: Kana[]): Kana[] {
    const others = allKana.filter(k => k.romanji !== correct.romanji);
    return shuffle([correct, ...shuffle(others).slice(0, 3)]);
}

export function useQuiz(kanaData: Kana[], script: 'hiragana' | 'katakana'): UseQuizReturn {
    const [phase, setPhase] = useState<Phase>('config');
    const [config, setConfig] = useState<QuizConfig | null>(null);
    const [questions, setQuestions] = useState<Kana[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [results, setResults] = useState<QuizResult[]>([]);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [choices, setChoices] = useState<Kana[]>([]);

    const questionsRef = useRef<Kana[]>([]);
    const timedOutRef = useRef(false);

    const currentKana = questions[currentIndex] ?? null;
    const displayChar = currentKana
        ? config?.mode === 'inverse'
            ? currentKana.romanji
            : script === 'hiragana' ? currentKana.hiragana : currentKana.katakana
        : '';

    useEffect(() => {
        if (phase === 'playing' && config?.timerSeconds != null) {
            setTimeLeft(config.timerSeconds);
            timedOutRef.current = false;
        }
    }, [currentIndex, phase]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || phase !== 'playing' || !!feedback) return;
        const id = setTimeout(() => setTimeLeft(t => t !== null ? t - 1 : null), 1000);
        return () => clearTimeout(id);
    }, [timeLeft, phase, feedback]);

    useEffect(() => {
        if (timeLeft === 0 && phase === 'playing' && !feedback && !timedOutRef.current && currentKana) {
            timedOutRef.current = true;
            recordResult(currentKana, '', false);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (config?.mode === 'inverse' && currentKana) {
            setChoices(generateChoices(currentKana, kanaData));
        }
    }, [currentIndex, config?.mode]);

    const recordResult = (kana: Kana, answer: string, correct: boolean) => {
        setResults(prev => [...prev, { kana, userAnswer: answer, correct }]);
        setScore(prev => prev + (correct ? 1 : 0));
        setFeedback(correct ? 'Correct !' : `Incorrect. C'était ${kana.romanji}`);
        setUserAnswer('');

        setTimeout(() => {
            setFeedback('');
            setCurrentIndex(prev => {
                const next = prev + 1;
                if (next >= questionsRef.current.length) {
                    setPhase('summary');
                    return prev;
                }
                return next;
            });
        }, 1500);
    };

    const startQuiz = (cfg: QuizConfig) => {
        const filtered = cfg.selectedRows.length > 0
            ? kanaData.filter(k => cfg.selectedRows.includes(getRow(k.romanji)))
            : kanaData;

        const qs = cfg.questionCount === 'all'
            ? shuffle(filtered)
            : shuffle(filtered).slice(0, Math.min(cfg.questionCount as number, filtered.length));

        questionsRef.current = qs;
        setConfig(cfg);
        setQuestions(qs);
        setCurrentIndex(0);
        setScore(0);
        setResults([]);
        setFeedback('');
        setUserAnswer('');
        setTimeLeft(null);
        timedOutRef.current = false;
        setPhase('playing');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim() || !currentKana || !!feedback) return;
        const correct = userAnswer.toLowerCase().trim() === currentKana.romanji.toLowerCase();
        recordResult(currentKana, userAnswer, correct);
    };

    const handleChoice = (kana: Kana) => {
        if (!currentKana || !!feedback) return;
        const correct = kana.romanji === currentKana.romanji;
        recordResult(currentKana, script === 'hiragana' ? kana.hiragana : kana.katakana, correct);
    };

    const restartQuiz = () => {
        setPhase('config');
        setConfig(null);
        setQuestions([]);
        questionsRef.current = [];
        setCurrentIndex(0);
        setScore(0);
        setResults([]);
        setFeedback('');
        setUserAnswer('');
        setTimeLeft(null);
    };

    return {
        phase, startQuiz, restartQuiz,
        displayChar, userAnswer, currentIndex,
        totalQuestions: questions.length,
        score, feedback, timeLeft, choices,
        mode: config?.mode ?? 'normal',
        setUserAnswer, handleSubmit, handleChoice, results,
    };
}