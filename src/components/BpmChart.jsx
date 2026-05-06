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

function BpmChart({ data = [], children }) {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const formattedData = (data || []).map((item, index) => ({
    day: days[index] ?? "",
    bpm: item?.bpm ?? 0
  }));

  const maxBpm = formattedData.length
    ? Math.max(...formattedData.map((item) => item.bpm))
    : 0;

  return (
    <div className={styles.chartContainer}>

      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h4 className={styles.title}>{maxBpm} BPM</h4>

          <p className={styles.subtitle}>
            Fréquence cardiaque moyenne
          </p>
        </div>

        <div className={styles.selector}>
          {children}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="bpm"
            radius={[10, 10, 0, 0]}
            barSize={14}
            fill="#ff2d2d"
          />

          <Line
            type="monotone"
            dataKey="bpm"
            dot={{ r: 5, fill: "#2d3eff" }}
            stroke="#000"
            strokeWidth={2}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default BpmChart;