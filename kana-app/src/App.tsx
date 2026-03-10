import { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { kanaData } from './data/kana';
import StudyMode from './components/StudyMode';
import QuizMode from './components/QuizMode';
import StatsPage from './pages/StatsPage';

export default function App() {
    const [script, setScript] = useState<'hiragana' | 'katakana'>('hiragana');

    return (
        <div className="app">
            <h1 className="app-title">Kana<span>.</span></h1>

            <nav className="nav">
                <NavLink to="/study">Étude</NavLink>
                <NavLink to="/quiz">Quiz</NavLink>
                <NavLink to="/stats">Stats</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/study" replace />} />

                <Route path="/study" element={
                    <>
                        <div className="script-selector">
                            <button className={`script-btn ${script === 'hiragana' ? 'active' : ''}`} onClick={() => setScript('hiragana')}>
                                Hiragana
                            </button>
                            <button className={`script-btn ${script === 'katakana' ? 'active' : ''}`} onClick={() => setScript('katakana')}>
                                Katakana
                            </button>
                        </div>
                        <StudyMode script={script} kanaData={kanaData} />
                    </>
                } />

                <Route path="/quiz" element={<QuizMode script={script} kanaData={kanaData} />} />
                <Route path="/stats" element={<StatsPage />} />

                <Route path="*" element={
                    <div className="not-found">
                        <p>Page introuvable</p>
                        <NavLink to="/">Accueil</NavLink>
                    </div>
                } />
            </Routes>
        </div>
    );
}