import { useState } from 'react';
import type { Kana } from '../data/kana';
import type { QuizConfig } from '../types/quizTypes';
import { DEFAULT_CONFIG, getAvailableRows } from '../types/quizTypes';

interface Props {
    kanaData: Kana[];
    onStart: (config: QuizConfig) => void;
}

export default function QuizConfig({ kanaData, onStart }: Props) {
    const [config, setConfig] = useState<QuizConfig>(DEFAULT_CONFIG);
    const rows = getAvailableRows(kanaData);

    const toggleRow = (row: string) => {
        setConfig(prev => ({
            ...prev,
            selectedRows: prev.selectedRows.includes(row)
                ? prev.selectedRows.filter(r => r !== row)
                : [...prev.selectedRows, row],
        }));
    };

    return (
        <div className="config-wrap">
            <h2>Configuration</h2>

            <div className="config-section">
                <span className="config-label">Questions</span>
                <div className="radio-group">
                    {([5, 10, 20, 'all'] as const).map(n => (
                        <button
                            key={String(n)}
                            className={`radio-btn ${config.questionCount === n ? 'active' : ''}`}
                            onClick={() => setConfig(prev => ({ ...prev, questionCount: n }))}
                        >
                            {n === 'all' ? 'Toutes' : n}
                        </button>
                    ))}
                </div>
            </div>

            <div className="config-section">
                <span className="config-label">Mode</span>
                <div className="radio-group">
                    <button
                        className={`radio-btn ${config.mode === 'normal' ? 'active' : ''}`}
                        onClick={() => setConfig(prev => ({ ...prev, mode: 'normal' }))}
                    >
                        Kana → rōmaji
                    </button>
                    <button
                        className={`radio-btn ${config.mode === 'inverse' ? 'active' : ''}`}
                        onClick={() => setConfig(prev => ({ ...prev, mode: 'inverse' }))}
                    >
                        Rōmaji → kana (QCM)
                    </button>
                </div>
            </div>

            <div className="config-section">
                <span className="config-label">Timer</span>
                <div className="radio-group">
                    {([null, 5, 10, 15] as const).map(t => (
                        <button
                            key={String(t)}
                            className={`radio-btn ${config.timerSeconds === t ? 'active' : ''}`}
                            onClick={() => setConfig(prev => ({ ...prev, timerSeconds: t }))}
                        >
                            {t === null ? 'Aucun' : `${t}s`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="config-section">
                <span className="config-label">
                    Lignes&nbsp;
                    <span style={{ color: '#555', textTransform: 'none', letterSpacing: 0 }}>
                        {config.selectedRows.length === 0 ? '(toutes)' : config.selectedRows.join(', ')}
                    </span>
                </span>
                <div className="rows-grid">
                    {rows.map(row => (
                        <button
                            key={row}
                            className={`row-tag ${config.selectedRows.includes(row) ? 'active' : ''}`}
                            onClick={() => toggleRow(row)}
                        >
                            {row}
                        </button>
                    ))}
                </div>
            </div>

            <button className="btn-start" onClick={() => onStart(config)}>
                Commencer
            </button>
        </div>
    );
}