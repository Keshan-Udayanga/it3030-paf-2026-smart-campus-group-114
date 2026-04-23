import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddResource.css";

const AddResource = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "LECTURE_HALL",
    capacity: "",
    location: "Building A",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/resources/add",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      console.log("Saved:", response.data);

      alert("Resource Added Successfully!");

      navigate("/admin/resource-management");
    } catch (error) {
      console.log("Error:", error);

      alert("Failed to add resource. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="add-resource-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Add New Resource</h2>

          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="resource-form">
          <div className="form-grid">
            {/* NAME */}
            <div className="form-group">
              <label>Resource Name</label>
              <input
                name="name"
                placeholder="Lecture Hall A"
                onChange={handleChange}
                required
              />
            </div>

            {/* TYPE */}
            <div className="form-group">
              <label>Type</label>
              <select name="type" onChange={handleChange}>
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Lab</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            {/* CAPACITY */}
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                placeholder="e.g. 120"
                onChange={handleChange}
                required
              />
            </div>

            {/* LOCATION */}
            <div className="form-group">
              <label>Location</label>
              <select name="location" onChange={handleChange}>
                <option value="Building A">Building A</option>
                <option value="Building B">Building B</option>
                <option value="Building C">Building C</option>
                <option value="Main Hall">Main Hall</option>
              </select>
            </div>

            {/* STATUS */}
            <div className="form-group full-width">
              <label>Status</label>
              <select name="status" onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : "Add Resource"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddResource;
