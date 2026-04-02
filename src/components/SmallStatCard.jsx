function SmallStatCard({ label, value }) {
  return (
    <div className="small-card">
      <p>{label}</p>
      <h4>{value}</h4>
    </div>
  );
}

export default SmallStatCard;