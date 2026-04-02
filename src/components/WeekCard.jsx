function WeekCard({ sessions }) {
  return (
    <div className="card">
      <p><strong>{sessions}</strong> sessions</p>
      <p>Courses réalisées</p>

      <div className="chart">
        Donut
      </div>
    </div>
  );
}

export default WeekCard;