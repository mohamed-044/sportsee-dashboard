import styles from "../style/ChartCard.module.css";

function ChartCard({ children }) {
  return (
    <div className={styles.chart}>
      {children}
    </div>
  );
}

export default ChartCard;