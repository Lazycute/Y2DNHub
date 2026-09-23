const phrases = [
  'Shine brightly',
  'Serve boldly',
  'Stay faithful',
  'Rise up',
  'Keep growing',
  'Lead boldly',
  'Trust God',
  'Press forward',
  'Stand strong',
  'Live purposefully',
];

function Group({ hidden }) {
  return (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {phrases.map((p) => <span key={p}>{p}</span>)}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" role="marquee" aria-label={phrases.join(', ')}>
      <div className="marquee-track">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
