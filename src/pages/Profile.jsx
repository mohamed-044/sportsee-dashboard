import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchUserInfo } from "../services/authService";
import "../style/Profile.css";
import StatCard from "../components/StatCard";
import UserCard from "../components/UserCard";
import ProfileCard from "../components/ProfileCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Profile() {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
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
          `http://localhost:8000/api/user-activity?startWeek=2025-01-01&endWeek=2025-12-31`,
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

        const formatted = data.map((session) => ({
          date: session.date,
          calories: session.caloriesBurned ?? 0,
        }));

        setSessions(formatted);
      } catch (err) {
        console.error(err);
        setSessions([]);
      }
    };

    fetchSessions();
  }, [token]);

  if (!userData) {
    return <div>Chargement...</div>;
  }

  const { profile, statistics } = userData;

  const totalCalories = sessions.reduce(
    (sum, s) => sum + s.calories,
    0
  );

  const uniqueDays = new Set(
    sessions.map((s) => new Date(s.date).toDateString())
  );

  const restDays = 365 - uniqueDays.size;

  return (
    <div className="profile-page">

      <Header />

      <main className="main">

        <div className="left">
          <UserCard profile={profile} />
          <ProfileCard profile={profile} />
        </div>

        <div className="right">

          <h2>Vos statistiques</h2>
          <p className="date">depuis {profile.createdAt}</p>

          <div className="stats-grid">
            <StatCard
              label="Temps total couru"
              value={statistics.totalDuration}
              unit="min"
            />

            <StatCard
              label="Calories brûlées"
              value={`${totalCalories} kcal`}
            />

            <StatCard
              label="Distance totale parcourue"
              value={statistics.totalDistance}
              unit="km"
            />

            <StatCard
              label="Jours de repos"
              value={`${restDays} jours`}
            />

            <StatCard
              label="Nombre de sessions"
              value={statistics.totalSessions}
            />
          </div>
        </div>

      </main>

      <Footer />

    </div>
  );
}

export default Profile;