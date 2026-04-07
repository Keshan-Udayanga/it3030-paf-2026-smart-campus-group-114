import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get token from URL or localStorage
    const params = new URLSearchParams(window.location.search);
    let token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Clean URL
      window.history.replaceState({}, document.title, "/dashboard");
    } else {
      token = localStorage.getItem("token");
      if (!token) {
        alert("!token called");
        navigate("/");
        return;
      } else {
        alert("!token passed from storage");
      }
    }

    // Verify token with backend
    axios.get("http://localhost:8080/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(() => {
      alert("Link rejected");
      localStorage.removeItem("token");
      navigate("/");
    });

  }, []);

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>
      {user ? <p>Welcome, {user.name}</p> : <p>Loading...</p>}
    </div>
  );
}

export default UserDashboard;