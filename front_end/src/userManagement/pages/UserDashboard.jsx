import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let token = params.get("token");
    

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/user-dashboard");
    } else {
      token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
    }

    axios.get("http://localhost:8080/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const roles = res.data.roles;
      localStorage.setItem("userName", res.data.name);
      //ROLE-BASED REDIRECT
      if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_RESOURCE_MANAGER")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    })
    .catch((err) => {
      if (err.response?.status === 403) {
        alert("Your account has been disabled");

        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      
      localStorage.removeItem("token");
      navigate("/");
    });

  }, []);

  return <p>Redirecting...</p>;
}

export default UserDashboard;