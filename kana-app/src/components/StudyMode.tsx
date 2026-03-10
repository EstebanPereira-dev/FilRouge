import type { Kana } from '../data/kana';

interface Props {
    script: 'hiragana' | 'katakana';
    kanaData: Kana[];
}

export default function StudyMode({ script, kanaData }: Props) {
    return (
        <div className="char-grid">
            {kanaData.map((kana, i) => (
                <div key={i} className="char-card">
                    <span className="kana">{script === 'hiragana' ? kana.hiragana : kana.katakana}</span>
                    <span className="romaji">{kana.romanji}</span>
                </div>
            ))}
        </div>
    );
}