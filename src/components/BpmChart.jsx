import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import styles from "../style/BpmChart.module.css";

function BpmChart({ data }) {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const formattedData = data.map((item, index) => ({
    day: days[index],
    bpm: item.bpm
  }));

  const maxBpm = Math.max(...data.map(item => item.bpm));

  return (
    <div className={styles.chartContainer}>
      <h4 className={styles.title}>{maxBpm} BPM</h4>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          
          <Bar
            className={styles.bar}
            dataKey="bpm"
            radius={[10, 10, 0, 0]}
            barSize={14}
          />

          <Line
            className={styles.line}
            type="monotone"
            dataKey="bpm"
            dot={{ className: styles.dot }}
            strokeWidth={2}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BpmChart;