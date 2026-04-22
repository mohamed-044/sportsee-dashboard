import "../style/ChartCard.css";
import DonutChart from "./DonutChart";

function WeekCard({ sessions }) {
  return (
    <div className="card">
      <p><strong>{sessions}</strong> sessions</p>
      <p>Courses réalisées</p>

      <div className="chart">
        <DonutChart sessions={sessions} />
      </div>
    </div>
  );
}

export default WeekCard;