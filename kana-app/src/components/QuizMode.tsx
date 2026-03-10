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
    if (quiz.phase === 'summary') return <QuizSummary results={quiz.results} score={quiz.score} script={script} onRestart={quiz.restartQuiz} />;

    const progress = quiz.totalQuestions > 0 ? (quiz.currentIndex / quiz.totalQuestions) * 100 : 0;

    return (
        <div className="quiz-wrap">
            <div className="quiz-header">
                <span>{quiz.currentIndex + 1} / {quiz.totalQuestions}</span>
                <span>Score : <strong>{quiz.score}</strong> &nbsp;|&nbsp; Record : <strong>{bestScore}</strong></span>
            </div>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {quiz.timeLeft !== null && (
                <div className={`timer ${quiz.timeLeft <= 3 ? 'urgent' : ''}`}>
                    ⏱ {quiz.timeLeft}s
                </div>
            )}

            <div className="quiz-char">{quiz.displayChar}</div>

            {quiz.mode === 'normal' && (
                <form className="quiz-form" onSubmit={quiz.handleSubmit}>
                    <input
                        ref={inputRef}
                        className="quiz-input"
                        type="text"
                        value={quiz.userAnswer}
                        onChange={e => quiz.setUserAnswer(e.target.value)}
                        placeholder="rōmaji..."
                        disabled={!!quiz.feedback}
                    />
                    <button className="btn-validate" type="submit" disabled={!!quiz.feedback}>
                        Valider
                    </button>
                </form>
            )}

            {quiz.mode === 'inverse' && (
                <div className="choices-grid">
                    {quiz.choices.map((kana, i) => (
                        <button
                            key={i}
                            className="choice-btn"
                            onClick={() => quiz.handleChoice(kana)}
                            disabled={!!quiz.feedback}
                        >
                            {script === 'hiragana' ? kana.hiragana : kana.katakana}
                        </button>
                    ))}
                </div>
            )}

            {quiz.feedback && (
                <div className={`feedback ${quiz.feedback === 'Correct !' ? 'correct' : 'incorrect'}`}>
                    {quiz.feedback}
                </div>
            )}
        </div>
    );
}