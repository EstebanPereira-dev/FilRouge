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
        <div style={{ maxWidth: '500px', margin: '20px auto' }}>
            <h2>Résultats</h2>

            <div style={{ fontSize: '2.5rem', textAlign: 'center', margin: '20px 0', fontWeight: 'bold' }}>
                {score} / {total}
                <span style={{ fontSize: '1.2rem', color: '#666', marginLeft: '12px' }}>({pct}%)</span>
            </div>

            {errors.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'green', fontSize: '1.2rem' }}>Parfait ! 🎉</p>
            ) : (
                <>
                    <h3>Erreurs ({errors.length})</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid #ddd' }}>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Kana</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Correct</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Ta réponse</th>
                        </tr>
                        </thead>
                        <tbody>
                        {errors.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontSize: '1.8rem' }}>
                                    {script === 'hiragana' ? r.kana.hiragana : r.kana.katakana}
                                </td>
                                <td style={{ padding: '8px', color: 'green', fontWeight: 'bold' }}>{r.kana.romanji}</td>
                                <td style={{ padding: '8px', color: 'red' }}>{r.userAnswer || '(timeout)'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            <button onClick={onRestart} style={{ marginTop: '28px', padding: '10px 28px', fontSize: '1rem', cursor: 'pointer' }}>
                Rejouer
            </button>
        </div>
    );
}