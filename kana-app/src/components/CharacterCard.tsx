interface CharacterCardProps {
  character: string;
  romanji: string;
}

export default function CharacterCard({ character, romanji }: CharacterCardProps) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem' }}>{character}</div>
      <div style={{ fontSize: '0.8rem' }}>{romanji}</div>
    </div>
  );
}