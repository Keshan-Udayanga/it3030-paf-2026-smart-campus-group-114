import { useEffect, useState } from "react";
import axios from "axios";
import "./UpdateResource.css";
import { useNavigate, useParams } from "react-router-dom";

function UpdateResource() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        capacity: "",
        location: "",
        status: ""
    });

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/resources", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const data = Array.isArray(res.data)
                    ? res.data
                    : res.data.data || [];

                const resource = data.find((r) => r.id == id);
                if (resource) setFormData(resource);
            })
            .catch((err) => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .put(`http://localhost:8080/api/resources/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                alert("Updated successfully!");
                navigate("/admin/resource-management");
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="update-page">
            <div className="update-form-box">

                <h2>Update Resource</h2>

                <form onSubmit={handleSubmit}>

                    {/* ROW 1 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="LECTURE_HALL">Lecture Hall</option>
                                <option value="LAB">Lab</option>
                                <option value="MEETING_ROOM">Meeting Room</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ROW 3 */}
                    <div className="form-group full-width">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                    </div>

                    <button className="update-btn">
                        Update Resource
                    </button>

                </form>
            </div>
        </div>
    );
}

export default UpdateResource;