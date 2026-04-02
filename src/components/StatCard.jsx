function StatCard({ label, value, unit }) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <h3>
        {value} {unit}
      </h3>
    </div>
  );
}

export default StatCard;