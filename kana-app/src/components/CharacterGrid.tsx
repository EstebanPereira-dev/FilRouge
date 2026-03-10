import type {Kana} from '../data/kana';
import CharacterCard from './CharacterCard';

interface CharacterGridProps {
  characters: Kana[];
  title: string;
  type: 'hiragana' | 'katakana';
}

export default function CharacterGrid({ characters, title, type }: CharacterGridProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {characters.map((kana, i) => (
          <CharacterCard
            key={i}
            character={type === 'hiragana' ? kana.hiragana : kana.katakana}
            romanji={kana.romanji}
          />
        ))}
      </div>
    </section>
  );
}