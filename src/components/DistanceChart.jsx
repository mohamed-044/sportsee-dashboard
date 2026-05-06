import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import styles from "../style/DistanceChart.module.css";

function DistanceChart({ data, children }) {
  const safeData = data || [];

  const formattedData = (data ?? []).map((item, index) => ({
    name: `S${index + 1}`,
    km: item.distance ?? 0
  }));

  const avgDistance =
    formattedData.length > 0
      ? (
          formattedData.reduce((sum, item) => sum + item.km, 0) /
          formattedData.length
        ).toFixed(0)
    : 0;

  const total = safeData.reduce((sum, item) => sum + (item.distance || 0), 0);


  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h4 className={styles.title}>{avgDistance} km en moyenne</h4>
          <p className={styles.subtitle}>
            Total des kilomètres 4 dernières semaines
          </p>
        </div>

        <div className={styles.selector}>
          {children}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="km"
            radius={[10, 10, 0, 0]}
            barSize={14}
            fill="#c7ccff"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DistanceChart;