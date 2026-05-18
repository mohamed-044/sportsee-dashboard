import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchUserInfo } from "../services/authService";
import "../style/Profile.css";
import StatCard from "../components/StatCard";
import UserCard from "../components/UserCard";
import ProfileCard from "../components/ProfileCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);
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
    if (!token) return;

    const fetchSessions = async () => {
      const res = await fetch(
        `http://localhost:8000/api/user-activity?startWeek=2025-01-01&endWeek=2025-12-31`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();

      setSessions(
        Array.isArray(data)
          ? data.map((s) => ({
              date: s.date,
              calories: s.caloriesBurned ?? 0
            }))
          : []
      );
    };

    fetchSessions();
  }, [token]);

  if (!token) return <Navigate to="/login" />;
  if (!userData) return <div>Chargement...</div>;

  const { profile, statistics } = userData;

  const totalCalories = sessions.reduce((sum, s) => sum + s.calories, 0);

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
          <p className="date">
            depuis le{" "}
            {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </p>

          <div className="stats-grid">
            <StatCard label="Temps total couru" value={statistics.totalDuration} unit="min" />
            <StatCard label="Calories brûlées" value={totalCalories} unit="kcal" />
            <StatCard label="Distance totale parcourue" value={statistics.totalDistance} unit="km" />
            <StatCard label="Jours de repos" value={restDays} unit="jours" />
            <StatCard label="Nombre de sessions" value={statistics.totalSessions} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;