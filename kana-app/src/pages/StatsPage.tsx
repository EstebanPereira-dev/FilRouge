import { Link } from 'react-router-dom';
import { useStats } from '../hooks/useStats';

export default function StatsPage() {
    const { sessions, bestScore, hardestCharacters, totalSessions, averageScore } = useStats();

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Statistiques</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                    { label: 'Sessions', value: totalSessions },
                    { label: 'Meilleur score', value: bestScore },
                    { label: 'Moy. réussite', value: `${averageScore}%` },
                ].map(({ label, value }) => (
                    <div key={label} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
                        <div style={{ color: '#666', marginTop: '4px' }}>{label}</div>
                    </div>
                ))}
            </div>

            {hardestCharacters.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                    <h3>Caractères difficiles</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid #ddd' }}>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Kana</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Rōmaji</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Essais</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Erreurs</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Taux</th>
                        </tr>
                        </thead>
                        <tbody>
                        {hardestCharacters.map((stat, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontSize: '1.6rem' }}>{stat.kana.hiragana}</td>
                                <td style={{ padding: '8px' }}>{stat.kana.romanji}</td>
                                <td style={{ padding: '8px' }}>{stat.attempts}</td>
                                <td style={{ padding: '8px', color: 'red' }}>{stat.errors}</td>
                                <td style={{ padding: '8px' }}>{Math.round(stat.errorRate * 100)}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {sessions.length > 0 ? (
                <div>
                    <h3>Historique</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid #ddd' }}>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Mode</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Score</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>%</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.map((s, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontSize: '0.9rem' }}>{s.date}</td>
                                <td style={{ padding: '8px' }}>{s.mode}</td>
                                <td style={{ padding: '8px' }}>{s.score} / {s.total}</td>
                                <td style={{ padding: '8px' }}>{Math.round((s.score / s.total) * 100)}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p style={{ color: '#888' }}>Aucune session pour l'instant.</p>
            )}

            <Link to="/quiz" style={{ display: 'inline-block', marginTop: '28px' }}>← Retour au quiz</Link>
        </div>
    );
}