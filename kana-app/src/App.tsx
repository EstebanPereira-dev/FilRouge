import { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { kanaData } from './data/kana';
import StudyMode from './components/StudyMode';
import QuizMode from './components/QuizMode';
import StatsPage from './pages/StatsPage';

export default function App() {
    const [script, setScript] = useState<'hiragana' | 'katakana'>('hiragana');

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
            <h1>Kana App</h1>

            <nav style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <NavLink to="/study">Étude</NavLink>
                <NavLink to="/quiz">Quiz</NavLink>
                <NavLink to="/stats">Stats</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/study" replace />} />

                <Route path="/study" element={
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ marginRight: '16px' }}>
                                <input type="radio" checked={script === 'hiragana'} onChange={() => setScript('hiragana')} />
                                {' '}Hiragana
                            </label>
                            <label>
                                <input type="radio" checked={script === 'katakana'} onChange={() => setScript('katakana')} />
                                {' '}Katakana
                            </label>
                        </div>
                        <StudyMode script={script} kanaData={kanaData} />
                    </div>
                } />

                <Route path="/quiz" element={<QuizMode script={script} kanaData={kanaData} />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="*" element={<><p>Page introuvable</p><NavLink to="/">Accueil</NavLink></>} />
            </Routes>
        </div>
    );
}