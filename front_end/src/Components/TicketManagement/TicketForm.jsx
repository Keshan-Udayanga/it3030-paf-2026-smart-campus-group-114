import React, { useState } from "react";
import axios from "axios";
import "./TicketForm.css";

function TicketForm() {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    resourceName: "",
    preferredContactName: "",
    preferredContactEmail: "",
    preferredContactPhone: ""
  });

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 3) {
      setMessage("Maximum 3 files allowed!");
      setType("error");
      e.target.value = null;
      return;
    }
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create the ticket
      const response = await axios.post(
        "http://localhost:8080/api/v1/tickets",
        formData
      );

      const ticketId = response.data.id;

      // Step 2: Upload attachments if any
      if (files.length > 0) {
        const formPayload = new FormData();
        files.forEach(file => formPayload.append("files", file));

        await axios.post(
          `http://localhost:8080/api/v1/tickets/${ticketId}/attachments`,
          formPayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      setMessage("Ticket Created Successfully!");
      setType("success");

      setTimeout(() => setMessage(""), 3000);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
        location: "",
        resourceName: "",
        preferredContactName: "",
        preferredContactEmail: "",
        preferredContactPhone: ""
      });
      setFiles([]);

    } catch (error) {
      console.error(error);
      setMessage("Error creating ticket!");
      setType("error");
    }
  };

  return (
    <div className="form-container">

      {/* 🔥 POPUP */}
      {message && <div className={`popup ${type}`}>{message}</div>}

      <h2 className="form-title">Create Ticket</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="">Select Priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="resourceName"
            placeholder="Resource Name"
            value={formData.resourceName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="preferredContactName"
            placeholder="Contact Name"
            value={formData.preferredContactName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="preferredContactEmail"
            placeholder="Contact Email"
            value={formData.preferredContactEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="preferredContactPhone"
            placeholder="Phone"
            value={formData.preferredContactPhone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="file-label">Attachments (max 3 files)</label>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="file-input"
          />
          {files.length > 0 && (
            <ul className="file-preview">
              {files.map((f, i) => <li key={i}>📎 {f.name}</li>)}
            </ul>
          )}
        </div>

        <button type="submit">Submit Ticket</button>

      </form>
    </div>
  );
}

export default TicketForm;