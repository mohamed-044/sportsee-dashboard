import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { fetchUserInfo } from "../services/authService";

function Dashboard() {

  const { token } = useContext(AuthContext);
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
    <div>
      <h1>Bonjour {profile.firstName}</h1>

      <img
        src={profile.profilePicture || "https://via.placeholder.com/120"}
        alt="profile"
        width="120"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://via.placeholder.com/120";
        }}
      />

      <h2>Statistiques</h2>

      <p>Distance totale : {statistics.totalDistance} km</p>
      <p>Sessions : {statistics.totalSessions}</p>
      <p>Durée totale : {statistics.totalDuration} min</p>

    </div>
  );
}

export default Dashboard;