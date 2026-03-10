import { Link } from 'react-router-dom';
import { useStats } from '../hooks/useStats';

export default function StatsPage() {
    const { sessions, bestScore, hardestCharacters, totalSessions, averageScore } = useStats();

    return (
        <div className="stats-wrap">
            <h2>Statistiques</h2>

            <div className="stats-cards">
                {[
                    { label: 'Sessions', value: totalSessions },
                    { label: 'Meilleur score', value: bestScore },
                    { label: 'Moy. réussite', value: `${averageScore}%` },
                ].map(({ label, value }) => (
                    <div key={label} className="stat-card">
                        <span className="stat-value">{value}</span>
                        <span className="stat-label">{label}</span>
                    </div>
                ))}
            </div>

            {hardestCharacters.length > 0 && (
                <>
                    <p className="section-title">Caractères difficiles</p>
                    <table className="stats-table">
                        <thead>
                        <tr>
                            <th>Kana</th>
                            <th>Rōmaji</th>
                            <th>Essais</th>
                            <th>Erreurs</th>
                            <th>Taux</th>
                        </tr>
                        </thead>
                        <tbody>
                        {hardestCharacters.map((stat, i) => (
                            <tr key={i}>
                                <td className="kana-big">{stat.kana.hiragana}</td>
                                <td>{stat.kana.romanji}</td>
                                <td>{stat.attempts}</td>
                                <td>{stat.errors}</td>
                                <td className="error-rate">{Math.round(stat.errorRate * 100)}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            {sessions.length > 0 ? (
                <>
                    <p className="section-title">Historique</p>
                    <table className="stats-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Mode</th>
                            <th>Score</th>
                            <th>%</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.map((s, i) => (
                            <tr key={i}>
                                <td>{s.date}</td>
                                <td>{s.mode}</td>
                                <td>{s.score} / {s.total}</td>
                                <td>{Math.round((s.score / s.total) * 100)}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p className="empty-state">Aucune session pour l'instant.</p>
            )}

            <Link to="/quiz" className="back-link">← Retour au quiz</Link>
        </div>
    );
}