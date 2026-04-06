import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Resources.css";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example API endpoint, replace with your Spring Boot API
    axios.get("http://localhost:8081/api/resources")
      .then((res) => {
        setResources(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resources:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="resources-page">
      <div className="container">
        <h2 className="page-title">Resources Catalogue</h2>
        {loading ? (
          <p className="loading">Loading resources...</p>
        ) : (
          <div className="resources-grid">
            {resources.map((res) => (
              <div key={res.id} className="resource-card">
                <h3>{res.name}</h3>
                <p><strong>Type:</strong> {res.type}</p>
                <p><strong>Capacity:</strong> {res.capacity}</p>
                <p><strong>Location:</strong> {res.location}</p>
                <p><strong>Status:</strong> <span className={res.status === "ACTIVE" ? "active" : "inactive"}>{res.status}</span></p>
                <div className="card-buttons">
                  <button>View</button>
                  <button>Book</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Resources;