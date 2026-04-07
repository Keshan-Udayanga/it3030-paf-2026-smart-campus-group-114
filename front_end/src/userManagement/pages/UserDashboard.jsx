import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if(token){
      localStorage.setItem("token", token);

      //Remove token from URL
      window.history.replaceState({}, document.titlem, "/dashboard");
    }else{
      const storedToken = localStorage.getItem("token");

      if(!storedToken){
        navigate("/");
      }
    }
  }, []);
  
  
  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>
      <p>Login successful</p>
    </div>
  );
}

export default UserDashboard;