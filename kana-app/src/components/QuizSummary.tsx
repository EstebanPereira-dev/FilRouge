import type { QuizResult } from '../types/quizTypes';

interface Props {
    results: QuizResult[];
    score: number;
    script: 'hiragana' | 'katakana';
    onRestart: () => void;
}

export default function QuizSummary({ results, score, script, onRestart }: Props) {
    const total = results.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const errors = results.filter(r => !r.correct);

    return (
        <div className="summary-wrap">
            <h2>Résultats</h2>

            <div className="summary-score">
                {score} / {total}
                <span className="pct">({pct}%)</span>
            </div>

            {errors.length === 0 ? (
                <p className="summary-perfect">Parfait ! 🎉</p>
            ) : (
                <>
                    <p className="errors-title">Erreurs ({errors.length})</p>
                    <table className="errors-table">
                        <thead>
                        <tr>
                            <th>Kana</th>
                            <th>Correct</th>
                            <th>Ta réponse</th>
                        </tr>
                        </thead>
                        <tbody>
                        {errors.map((r, i) => (
                            <tr key={i}>
                                <td className="kana-cell">{script === 'hiragana' ? r.kana.hiragana : r.kana.katakana}</td>
                                <td className="correct-cell">{r.kana.romanji}</td>
                                <td className="wrong-cell">{r.userAnswer || '(timeout)'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            <button className="btn-replay" onClick={onRestart}>Rejouer</button>
        </div>
    );
}