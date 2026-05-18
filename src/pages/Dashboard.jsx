import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect, useMemo } from "react";
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

const getCurrentWeek = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};

function Dashboard() {
  const { token } = useContext(AuthContext);

  const currentWeek = useMemo(() => getCurrentWeek(), []);

  const [userData, setUserData] = useState(null);

  const [startDate, setStartDate] = useState(currentWeek.monday);
  const [endDate, setEndDate] = useState(currentWeek.sunday);

  const [distanceStartDate, setDistanceStartDate] = useState(() => {
    const d = new Date(currentWeek.monday);
    d.setDate(d.getDate() - 21);
    return d;
  });

  const [distanceEndDate, setDistanceEndDate] = useState(currentWeek.sunday);

  const [sessions, setSessions] = useState([]);
  const [distanceSessions, setDistanceSessions] = useState([]);

  const { logout } = useContext(AuthContext);
  
  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const data = await fetchUserInfo(token);
        setUserData(data);
      } catch (error) {
        logout();
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        return <Navigate to="/login" replace />;
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (!token || !startDate || !endDate) return;

    const fetchSessions = async () => {
      const url = new URL("http://localhost:8000/api/user-activity");

      url.searchParams.set("startWeek", startDate.toISOString().split("T")[0]);
      url.searchParams.set("endWeek", endDate.toISOString().split("T")[0]);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        setSessions([]);
        return;
      }

      setSessions(
        data.map((s) => ({
          date: s.date,
          distance: s.distance || 0,
          bpm: s.heartRate?.average || 0,
          duration: s.duration || 0
        }))
      );
    };

    fetchSessions();
  }, [startDate, endDate, token]);

  useEffect(() => {
    if (!token || !distanceStartDate || !distanceEndDate) return;

    const fetchDistance = async () => {
      const url = new URL("http://localhost:8000/api/user-activity");

      url.searchParams.set(
        "startWeek",
        distanceStartDate.toISOString().split("T")[0]
      );
      url.searchParams.set(
        "endWeek",
        distanceEndDate.toISOString().split("T")[0]
      );

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        setDistanceSessions([]);
        return;
      }

      setDistanceSessions(
        data.map((s) => ({
          date: s.date,
          distance: s.distance || 0,
          duration: s.duration || 0
        }))
      );
    };

    fetchDistance();
  }, [distanceStartDate, distanceEndDate, token]);

  const changeWeek = (dir) => {
    setStartDate((p) => {
      const d = new Date(p);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });

    setEndDate((p) => {
      const d = new Date(p);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
  };

  const changeDistanceWeek = (dir) => {
    setDistanceStartDate((p) => {
      const d = new Date(p);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });

    setDistanceEndDate((p) => {
      const d = new Date(p);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
  };

  const filteredSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d >= startDate && d <= endDate;
  });

  const currentWeekSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d >= currentWeek.monday && d <= currentWeek.sunday;
  });

  const groupedDistanceSessions = [...Array(4)].map((_, i) => {
    const weekStart = new Date(distanceStartDate);
    weekStart.setDate(weekStart.getDate() + i * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekSessions = distanceSessions.filter((s) => {
      const d = new Date(s.date);
      return d >= weekStart && d <= weekEnd;
    });

    return {
      week: `S${i + 1}`,
      distance: weekSessions.reduce((a, b) => a + b.distance, 0),
      duration: weekSessions.reduce((a, b) => a + b.duration, 0)
    };
  });

  const bpmSessions = [...Array(7)].map((_, i) => {
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);

    const session = filteredSessions.find((s) => {
      const d = new Date(s.date);
      return d.toDateString() === day.toDateString();
    });

    return {
      date: day.toISOString().split("T")[0],
      bpm: session?.bpm || 0
    };
  });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("fr-FR");

  if (!token) return <Navigate to="/login" />;
  if (!userData) return <div>Chargement...</div>;

  const { profile, statistics } = userData;

  // Calculate total duration and distance for the current week only
  const fixedWeekSessions = currentWeekSessions;

  const fixedTotalDuration = fixedWeekSessions.reduce(
    (a, b) => a + b.duration,
    0
  );

  const fixedTotalDistance = fixedWeekSessions.reduce(
    (a, b) => a + b.distance,
    0
  );

  return (
    <div className={styles.dashboard}>
      <Header />

      <main className={styles.main}>
        <UserSummary profile={profile} statistics={statistics} />

        <section className={styles.performance}>
          <h3>Vos dernières performances</h3>

          <div className={styles.charts}>
            <ChartCard>
              <DistanceChart data={groupedDistanceSessions}>
                <WeekSelector
                  startDate={distanceStartDate}
                  endDate={distanceEndDate}
                  onPrev={() => changeDistanceWeek(-1)}
                  onNext={() => changeDistanceWeek(1)}
                />
              </DistanceChart>
            </ChartCard>

            <ChartCard>
              <BpmChart data={bpmSessions}>
                <WeekSelector
                  startDate={startDate}
                  endDate={endDate}
                  onPrev={() => changeWeek(-1)}
                  onNext={() => changeWeek(1)}
                />
              </BpmChart>
            </ChartCard>
          </div>

          <div>
            <h3>Cette semaine</h3>
            <p>
              Du {formatDate(startDate)} au {formatDate(endDate)}
            </p>
          </div>

          <div className={styles.bottomSection}>
            <ChartCard>
              <DonutChart sessions={sessions.length} total={6} />
            </ChartCard>

            <div className={styles.smallStats}>
              <SmallStatCard
                label="Durée d'activité"
                type="minutes"
                value={{ number: fixedTotalDuration, unit: " min" }}
              />

              <SmallStatCard
                label="Distance"
                type="distance"
                value={{
                  number: fixedTotalDistance.toFixed(1),
                  unit: " km"
                }}
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