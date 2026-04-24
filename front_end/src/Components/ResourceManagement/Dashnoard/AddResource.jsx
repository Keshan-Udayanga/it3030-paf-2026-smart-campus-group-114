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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ======================
  // VALIDATION
  // ======================
  const validate = (name, value) => {
    let error = "";

    if (name === "capacity") {
      if (value === "") {
        error = "Capacity is required";
      } else if (Number(value) <= 0) {
        error = "Capacity must be greater than 0";
      }
    }

    return error;
  };

  // ======================
  // HANDLE CHANGE (REAL TIME)
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    const errorMsg = validate(name, value);

    setErrors({
      ...errors,
      [name]: errorMsg,
    });
  };

  // ======================
  // FORM VALID CHECK
  // ======================
  const isFormValid =
    formData.capacity > 0 &&
    !errors.capacity &&
    formData.name.trim() !== "";

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/resources/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
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

        {/* HEADER */}
        <div className="form-header">
          <h2>Add New Resource</h2>

          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="resource-form">

          <div className="form-grid">

            {/* NAME */}
            <div className="form-group">
              <label>Resource Name</label>
              <input
                name="name"
                placeholder="Lecture Hall A"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </div>

            {/* TYPE */}
            <div className="form-group">
              <label>Type</label>
              <select name="type" onChange={handleChange} value={formData.type}>
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
                value={formData.capacity}
                className={errors.capacity ? "input-error" : ""}
                required
              />

              {errors.capacity && (
                <small className="error-text">
                  {errors.capacity}
                </small>
              )}
            </div>

            {/* LOCATION */}
            <div className="form-group">
              <label>Location</label>
              <select
                name="location"
                onChange={handleChange}
                value={formData.location}
              >
                <option value="Building A">Building A</option>
                <option value="Building B">Building B</option>
                <option value="Building C">Building C</option>
                <option value="Main Hall">Main Hall</option>
              </select>
            </div>

            {/* STATUS */}
            <div className="form-group full-width">
              <label>Status</label>
              <select
                name="status"
                onChange={handleChange}
                value={formData.status}
              >
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="btn-submit"
            disabled={loading || !isFormValid}
          >
            {loading ? "Saving..." : "Add Resource"}
          </button>

        </form>
      </div>
    </section>
  );
};

export default AddResource;