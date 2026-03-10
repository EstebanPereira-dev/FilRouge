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
        <div style={{ maxWidth: '420px', margin: '20px auto' }}>
            <h2>Configuration</h2>

            <div style={{ marginBottom: '20px' }}>
                <strong>Questions</strong>
                <div style={{ marginTop: '8px' }}>
                    {([5, 10, 20, 'all'] as const).map(n => (
                        <label key={String(n)} style={{ marginRight: '16px' }}>
                            <input
                                type="radio"
                                checked={config.questionCount === n}
                                onChange={() => setConfig(prev => ({ ...prev, questionCount: n }))}
                            />
                            {' '}{n === 'all' ? 'Toutes' : n}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <strong>Mode</strong>
                <div style={{ marginTop: '8px' }}>
                    <label style={{ marginRight: '16px' }}>
                        <input
                            type="radio"
                            checked={config.mode === 'normal'}
                            onChange={() => setConfig(prev => ({ ...prev, mode: 'normal' }))}
                        />
                        {' '}Kana → rōmaji
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={config.mode === 'inverse'}
                            onChange={() => setConfig(prev => ({ ...prev, mode: 'inverse' }))}
                        />
                        {' '}Rōmaji → kana (QCM)
                    </label>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <strong>Timer</strong>
                <div style={{ marginTop: '8px' }}>
                    {([null, 5, 10, 15] as const).map(t => (
                        <label key={String(t)} style={{ marginRight: '16px' }}>
                            <input
                                type="radio"
                                checked={config.timerSeconds === t}
                                onChange={() => setConfig(prev => ({ ...prev, timerSeconds: t }))}
                            />
                            {' '}{t === null ? 'Aucun' : `${t}s`}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
                <strong>Lignes</strong>
                <small style={{ color: '#888', marginLeft: '8px' }}>
                    {config.selectedRows.length === 0 ? '(toutes)' : config.selectedRows.join(', ')}
                </small>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    {rows.map(row => (
                        <button
                            key={row}
                            onClick={() => toggleRow(row)}
                            style={{
                                padding: '4px 12px',
                                border: '1px solid #999',
                                borderRadius: '4px',
                                background: config.selectedRows.includes(row) ? '#0066cc' : 'white',
                                color: config.selectedRows.includes(row) ? 'white' : 'black',
                                cursor: 'pointer',
                            }}
                        >
                            {row}
                        </button>
                    ))}
                </div>
            </div>

            <button onClick={() => onStart(config)} style={{ padding: '10px 28px', fontSize: '1rem', cursor: 'pointer' }}>
                Commencer
            </button>
        </div>
    );
}