import { useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Profile() {
  const storedUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [formData, setFormData] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${API_URL}/profile/${storedUser._id}`,
        {
          name: formData.name,
          email: formData.email
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setFormData({
        name: response.data.user.name,
        email: response.data.user.email
      });

      setMessage("Profile updated successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="main-container">
        <Sidebar />

        <main className="content">
          <div className="page-header">
            <div>
              <h1>My Profile</h1>
              <p>View and update your profile information</p>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">
              {formData.name
                ? formData.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <h2>{formData.name || "User"}</h2>

            <p className="profile-email">
              {formData.email}
            </p>

            <form
              className="profile-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              {message && (
                <p className="profile-success">
                  ✓ {message}
                </p>
              )}

              {error && (
                <p className="profile-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Update Profile"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
