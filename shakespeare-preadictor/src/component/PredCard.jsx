export default function PredCard({ word, prob, rank, delay }) {
  return (
    <div className="pred-card" style={{ animationDelay: `${delay}ms` }}>
      <span className="pred-rank">{rank}</span>
      <span className="pred-word">{word}</span>
      <div className="pred-bar-wrap">
        <div className="pred-bar-track">
          <div className="pred-bar-fill" style={{ animationDelay: `${delay + 100}ms`, width: `${Math.min(prob, 100)}%` }} />
        </div>
      </div>
      <span className="pred-prob">{prob.toFixed(1)}%</span>
    </div>
  );
}