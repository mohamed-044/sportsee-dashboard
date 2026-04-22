import styles from "../style/WeekSelector.module.css";

function WeekSelector({ startDate, endDate, onPrev, onNext }) {

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short"
    });
  };

  return (
    <div className={styles.container}>
      <button onClick={onPrev} className={styles.arrow}>❮</button>

      <span className={styles.text}>
        {formatDate(startDate)} - {formatDate(endDate)}
      </span>

      <button onClick={onNext} className={styles.arrow}>❯</button>
    </div>
  );
}

export default WeekSelector;