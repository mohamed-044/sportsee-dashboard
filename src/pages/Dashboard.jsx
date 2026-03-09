import { Navigate } from "react-router-dom";

function Dashboard() {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <h1>Dashboard</h1>;
}

export default Dashboard;