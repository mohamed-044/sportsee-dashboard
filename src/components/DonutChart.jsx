import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import styles from "../style/DonutChart.module.css";

function DonutChart({ sessions, total = 6 }) {
  const data = [
    { name: "réalisées", value: sessions },
    { name: "restantes", value: total - sessions }
  ];

  return (
    <div className={styles.wrapper}>

      <div className={styles.header}>
        <h3>
          <span className={styles.highlight}>x{sessions}</span> sur objectif de {total}
        </h3>
        <p>Courses hebdomadaire réalisées</p>
      </div>

      <div className={styles.content}>

        <span className={`${styles.label} ${styles.left}`}>
          <span className={`${styles.dot} ${styles.blue}`}></span>
          {sessions} réalisées
        </span>

        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={50}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#2d3eff" />
              <Cell fill="#a0a6d6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <span className={`${styles.label} ${styles.right}`}>
          <span className={`${styles.dot} ${styles.light}`}></span>
          {total - sessions} restants
        </span>

      </div>
    </div>
  );
}

export default DonutChart;