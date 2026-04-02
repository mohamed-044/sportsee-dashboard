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

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchUserInfo(token);
        console.log("userData:", data);
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [token]);

  if (!userData) {
    return <div>Chargement...</div>;
  }

  const { profile, statistics } = userData;

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
              label="Distance totale"
              value={statistics.totalDistance}
              unit="km"
            />

            <StatCard
              label="Durée totale"
              value={statistics.totalDuration}
              unit="min"
            />

            <StatCard
              label="Sessions"
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