import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";

function Dashboard() {

  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  if (!token) {
    return <Navigate to="/login" />;
  }
    useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user-info", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        console.log("userData:", data);
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [token]);

  const { profile, statistics } = userData;

  return (
    <div>
      <h1>Bonjour {profile.firstName}</h1>

      <img
        src={profile.profilePicture}
        alt="profile"
        width="120"
      />

      <h2>Statistiques</h2>

      <p>Distance totale : {statistics.totalDistance} km</p>
      <p>Sessions : {statistics.totalSessions}</p>
      <p>Durée totale : {statistics.totalDuration} min</p>

    </div>
  );
}

export default Dashboard;