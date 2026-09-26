import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function AddIncome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    source: "Salary",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0]
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/income`, {
        ...formData,
        userId: user._id,
        amount: Number(formData.amount)
      });

      alert("Income added successfully");
      navigate("/income");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to add income"
      );
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
              <h1>Add Income</h1>
              <p>Record a new income</p>
            </div>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                >
                  <option>Salary</option>
                  <option>Pocket Money</option>
                  <option>Freelancing</option>
                  <option>Scholarship</option>
                  <option>Business</option>
                  <option>Gift</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <button className="primary-button" type="submit">
                Save Income
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddIncome;
