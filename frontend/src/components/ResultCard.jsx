const LABELS = {
  category: "Category",
  primary_colors: "Primary colors",
  pattern: "Pattern",
  style: "Style",
};

function ResultCard({ result, onReset }) {
  const colors = result.primary_colors || (result.primary_color ? [result.primary_color] : []);

  return (
    <div className="result-content">
      <div className="result-header">
        <div>
          <p className="result-kicker"><span /> Analysis complete</p>
          <h2>{result.category}</h2>
        </div>
        <span className="result-number">02</span>
      </div>

      <p className="description">“{result.description}”</p>

      <div className="detail-grid">
        {Object.entries(LABELS).map(([key, label]) => (
          <div className="detail-item" key={key}>
            <span>{label}</span>
            <strong>{key === "primary_colors" ? colors.join(", ") : result[key]}</strong>
          </div>
        ))}
      </div>

      <div className="season-block">
        <span>Recommended season</span>
        <div className="season-list">
          {result.season.map((season) => <span key={season}>{season}</span>)}
        </div>
      </div>

      <button className="reset-button" type="button" onClick={onReset}>
        <span aria-hidden="true">↻</span> Try another image
      </button>
    </div>
  );
}

export default ResultCard;
