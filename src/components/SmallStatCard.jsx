import styles from "../style/SmallStatCard.module.css";

function SmallStatCard({ label, value }) {
  return (
    <div className={styles.smallCard}>
      <p>{label}</p>
      <h4>{value}</h4>
    </div>
  );
}

export default SmallStatCard;