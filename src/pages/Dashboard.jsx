import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUserInfo } from "../services/authService";
import "../style/Dashboard.css";
import Header from "../components/Header";
import UserSummary from "../components/UserSummary";
import ChartCard from "../components/ChartCard";
import WeekCard from "../components/WeekCard";
import SmallStatCard from "../components/SmallStatCard";
import Footer from "../components/Footer";
import DistanceChart from "../components/DistanceChart";
import BpmChart from "../components/BpmChart";
import DonutChart from "../components/DonutChart";

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
    <div className="dashboard">

      <Header />

      <main className="main">

        <UserSummary profile={profile} statistics={statistics} />

        <section className="performance">
          <h3>Vos dernières performances</h3>

          <div className="charts">
            <ChartCard>Graphique 1</ChartCard>
            <ChartCard>Graphique 2</ChartCard>
          </div>
        </section>

        <section className="week">
          <h3>Cette semaine</h3>

          <div className="week-content">

            <div className="week-left">
              <WeekCard sessions={statistics.totalSessions} />
            </div>

            <div className="week-right">
              <SmallStatCard
                label="Durée d'activité"
                value={`${statistics.totalDuration} minutes`}
              />

              <SmallStatCard
                label="Distance"
                value={`${statistics.totalDistance} km`}
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