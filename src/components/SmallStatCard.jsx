import styles from "../style/SmallStatCard.module.css";

function SmallStatCard({ label, value, type }) {
  return (
    <div className={styles.smallCard}>
      <p>{label}</p>

      <h4 className={styles[type]}>
        {value.number}
        <span className={styles[`unit-${type}`]}>{value.unit}</span>
      </h4>
    </div>
  );
}

export default SmallStatCard;