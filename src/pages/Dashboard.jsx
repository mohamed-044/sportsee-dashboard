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
import WeekSelector from "../components/WeekSelector";

function Dashboard() {
  const { token } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);

  const [startDate, setStartDate] = useState(new Date("2025-01-01"));
  const [endDate, setEndDate] = useState(new Date("2025-01-07"));

  const [sessions, setSessions] = useState([]);

  const [distanceStartDate, setDistanceStartDate] = useState(new Date("2025-01-01"));
  const [distanceEndDate, setDistanceEndDate] = useState(new Date("2025-01-28"));

  const [distanceSessions, setDistanceSessions] = useState([]);

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

  useEffect(() => {
    if (!token) return;

    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/user-activity?startWeek=${startDate.toISOString()}&endWeek=${endDate.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!Array.isArray(data)) {
          setSessions([]);
          return;
        }

        const formattedSessions = data.map((session) => ({
          date: session.date,
          distance: session.distance,
          bpm: session.heartRate?.average ?? 0,
          duration: session.duration,
          calories: session.caloriesBurned ?? 0
        }));

      const totalCalories = sessions.reduce(
        (sum, s) => sum + (s.calories || 0),
        0
      );

      const restDays = 7 - sessions.length;

        setSessions(formattedSessions);
      } catch (err) {
        console.error(err);
        setSessions([]);
      }
    };

    fetchSessions();
  }, [startDate, endDate, token]);

  useEffect(() => {
    if (!token) return;

    const fetchDistanceSessions = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/user-activity?startWeek=${distanceStartDate.toISOString()}&endWeek=${distanceEndDate.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!Array.isArray(data)) {
          setDistanceSessions([]);
          return;
        }

        const formattedSessions = data.map((session) => ({
          date: session.date,
          distance: session.distance,
          bpm: session.heartRate?.average ?? 0,
          duration: session.duration,
        }));

        setDistanceSessions(formattedSessions);
      } catch (err) {
        console.error(err);
        setDistanceSessions([]);
      }
    };

    fetchDistanceSessions();
  }, [distanceStartDate, distanceEndDate, token]);

  const changeWeek = (direction) => {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    newStart.setDate(newStart.getDate() + direction * 7);
    newEnd.setDate(newEnd.getDate() + direction * 7);

    setStartDate(newStart);
    setEndDate(newEnd);
  };

  const changeDistanceWeek = (direction) => {
    const newStart = new Date(distanceStartDate);
    const newEnd = new Date(distanceEndDate);

    newStart.setDate(newStart.getDate() + direction * 28);
    newEnd.setDate(newEnd.getDate() + direction * 28);

    setDistanceStartDate(newStart);
    setDistanceEndDate(newEnd);
  };

  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startDate && sessionDate <= endDate;
  });

  const groupedDistanceSessions = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(distanceStartDate);
    weekStart.setDate(weekStart.getDate() + i * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekSessions = distanceSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const totalDistance = weekSessions.reduce((sum, s) => sum + s.distance, 0);
    const totalDuration = weekSessions.reduce((sum, s) => sum + s.duration, 0);

    return {
      week: `S${i + 1}`,
      distance: totalDistance,
      duration: totalDuration,
    };
  });

  const bpmSessions = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + i);

    const sessionForDay = filteredSessions.find((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === dayDate.toDateString();
    });

    return {
      date: dayDate.toISOString().split("T")[0],
      bpm: sessionForDay ? sessionForDay.bpm : 0,
    };
  });

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!userData) {
    return <div>Chargement...</div>;
  }

  const { profile, statistics } = userData;

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
                startDate={distanceStartDate}
                endDate={distanceEndDate}
                onPrev={() => changeDistanceWeek(-1)}
                onNext={() => changeDistanceWeek(1)}
              />
              <DistanceChart data={groupedDistanceSessions} />
            </ChartCard>

            <ChartCard className={styles.bpmCard}>
              <WeekSelector
                startDate={startDate}
                endDate={endDate}
                onPrev={() => changeWeek(-1)}
                onNext={() => changeWeek(1)}
              />
              <BpmChart data={bpmSessions} />
            </ChartCard>

            <ChartCard className={styles.donutCard}>
              <DonutChart sessions={sessions.length} total={6} />
            </ChartCard>

            <div className={styles.smallStats}>
              <SmallStatCard
                label="Durée d'activité"
                value={`${groupedDistanceSessions.reduce((sum, s) => sum + s.duration, 0)} minutes`}
              />
              <SmallStatCard
                label="Distance"
                value={`${groupedDistanceSessions.reduce((sum, s) => sum + s.distance, 0).toFixed(1)} km`}
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