import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import styles from "../style/DistanceChart.module.css";

function DistanceChart({ data }) {
  const formattedData = data.map((item, index) => ({
    name: `S${index + 1}`,
    km: item.distance
  }));

  const avgDistance = (data.reduce((sum, item) => sum + item.distance, 0) / data.length).toFixed(0);

  return (
    <div className={styles.chartContainer}>
      <h4 className={styles.title}>{avgDistance}km en moyenne</h4>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            className={styles.bar}
            dataKey="km"
            radius={[10, 10, 0, 0]}
            barSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DistanceChart;