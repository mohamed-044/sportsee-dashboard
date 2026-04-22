import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUserInfo } from "../services/authService";
import styles from "../style/Dashboard.module.css";
import Header from "../components/Header";
import UserSummary from "../components/UserSummary";
import ChartCard from "../components/ChartCard";
import SmallStatCard from "../components/SmallStatCard";
import Footer from "../components/Footer";
import DistanceChart from "../components/DistanceChart";
import BpmChart from "../components/BpmChart";
import DonutChart from "../components/DonutChart";
import mockSessions from "../mocks/sessions";
import WeekSelector from "../components/WeekSelector";

function Dashboard() {
  const { token } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const data = await fetchUserInfo(token);
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [token]);

  const changeWeek = (direction) => {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    newStart.setDate(newStart.getDate() + direction * 7);
    newEnd.setDate(newEnd.getDate() + direction * 7);

    setStartDate(newStart);
    setEndDate(newEnd);
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!userData) {
    return <div>Chargement...</div>;
  }

  const { profile, statistics } = userData;

  const weeklyDistance = mockSessions.reduce(
    (sum, session) => sum + session.distance,
    0
  );

  const weeklyDuration = mockSessions.length * 20;

  return (
    <div className={styles.dashboard}>
      <Header />

      <main className={styles.main}>
        <UserSummary profile={profile} statistics={statistics} />

        <section className={styles.performance}>
          <h3>Vos dernières performances</h3>

          

          <div className={styles.charts}>
  
          <ChartCard className={styles.distanceCard}>
           <WeekSelector
                startDate={startDate}
                endDate={endDate}
                onPrev={() => changeWeek(-1)}
                onNext={() => changeWeek(1)}
              />

            <DistanceChart data={mockSessions} />
          </ChartCard>

          <ChartCard className={styles.bpmCard}>
              <WeekSelector
                startDate={startDate}
                endDate={endDate}
                onPrev={() => changeWeek(-1)}
                onNext={() => changeWeek(1)}
              />


            <BpmChart data={mockSessions} />
          </ChartCard>

          <ChartCard className={styles.donutCard}>
            <DonutChart sessions={mockSessions.length} total={6} />
          </ChartCard>

          <div className={styles.smallStats}>
            <SmallStatCard
              label="Durée d'activité"
              value={`${weeklyDuration} minutes`}
            />
            <SmallStatCard
              label="Distance"
              value={`${weeklyDistance} km`}
            />
          </div>

        </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;