import { useRef, useEffect } from 'react';
import type { Kana } from '../data/kana';
import { useQuiz } from '../hooks/useQuiz';
import { useStats } from '../hooks/useStats';
import QuizConfig from './QuizConfig';
import QuizSummary from './QuizSummary';

interface Props {
    script: 'hiragana' | 'katakana';
    kanaData: Kana[];
}

export default function QuizMode({ script, kanaData }: Props) {
    const quiz = useQuiz(kanaData, script);
    const { saveSession, bestScore } = useStats();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (quiz.phase === 'playing' && quiz.mode === 'normal') {
            inputRef.current?.focus();
        }
    }, [quiz.currentIndex, quiz.phase, quiz.mode]);

    useEffect(() => {
        if (quiz.phase === 'summary') {
            saveSession({
                id: Date.now().toString(),
                date: new Date().toLocaleString('fr-FR'),
                score: quiz.score,
                total: quiz.results.length,
                results: quiz.results,
                mode: quiz.mode,
            });
        }
    }, [quiz.phase]);

    if (quiz.phase === 'config') return <QuizConfig kanaData={kanaData} onStart={quiz.startQuiz} />;

    if (quiz.phase === 'summary') {
        return <QuizSummary results={quiz.results} score={quiz.score} script={script} onRestart={quiz.restartQuiz} />;
    }

    const progress = quiz.totalQuestions > 0 ? (quiz.currentIndex / quiz.totalQuestions) * 100 : 0;

    return (
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>{quiz.currentIndex + 1} / {quiz.totalQuestions}</span>
                <span>Score : {quiz.score} | Record : {bestScore}</span>
            </div>

            <div style={{ height: '6px', background: '#eee', borderRadius: '3px', marginBottom: '16px' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#0066cc', borderRadius: '3px', transition: 'width 0.3s' }} />
            </div>

            {quiz.timeLeft !== null && (
                <div style={{ textAlign: 'center', fontSize: '1.3rem', color: quiz.timeLeft <= 3 ? 'red' : '#333', marginBottom: '8px', fontWeight: quiz.timeLeft <= 3 ? 'bold' : 'normal' }}>
                    ⏱ {quiz.timeLeft}s
                </div>
            )}

            <div style={{ fontSize: '5rem', textAlign: 'center', margin: '20px 0' }}>
                {quiz.displayChar}
            </div>

            {quiz.mode === 'normal' && (
                <form onSubmit={quiz.handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={quiz.userAnswer}
                        onChange={e => quiz.setUserAnswer(e.target.value)}
                        placeholder="Rōmaji..."
                        disabled={!!quiz.feedback}
                        style={{ padding: '8px', fontSize: '1rem', marginRight: '8px', width: '160px' }}
                    />
                    <button type="submit" disabled={!!quiz.feedback}>Valider</button>
                </form>
            )}

            {quiz.mode === 'inverse' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                    {quiz.choices.map((kana, i) => (
                        <button
                            key={i}
                            onClick={() => quiz.handleChoice(kana)}
                            disabled={!!quiz.feedback}
                            style={{ fontSize: '2.5rem', padding: '20px', cursor: quiz.feedback ? 'default' : 'pointer', border: '2px solid #ccc', borderRadius: '10px', background: 'white' }}
                        >
                            {script === 'hiragana' ? kana.hiragana : kana.katakana}
                        </button>
                    ))}
                </div>
            )}

            {quiz.feedback && (
                <div style={{ marginTop: '16px', padding: '10px', textAlign: 'center', color: quiz.feedback === 'Correct !' ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {quiz.feedback}
                </div>
            )}
        </div>
    );
}