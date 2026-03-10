import type { Kana } from '../data/kana';
import CharacterCard from './CharacterCard';

interface Props {
    script: 'hiragana' | 'katakana';
    kanaData: Kana[];
}

export default function StudyMode({ script, kanaData }: Props) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {kanaData.map((kana, i) => (
                    <CharacterCard
                        key={i}
                        character={script === 'hiragana' ? kana.hiragana : kana.katakana}
                        romanji={kana.romanji}
                    />
                ))}
            </div>
        </div>
    );
}