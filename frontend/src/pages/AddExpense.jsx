import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function AddExpense() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    paymentMethod: "Cash",
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
      await axios.post(`${API_URL}/expenses`, {
        ...formData,
        userId: user._id,
        amount: Number(formData.amount)
      });

      alert("Expense added successfully");
      navigate("/expenses");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to add expense"
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
              <h1>Add Expense</h1>
              <p>Record a new expense</p>
            </div>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
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
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Shopping</option>
                  <option>Education</option>
                  <option>Bills</option>
                  <option>Entertainment</option>
                  <option>Medical</option>
                  <option>Travel</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Debit Card</option>
                  <option>Credit Card</option>
                  <option>Net Banking</option>
                </select>
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
                Save Expense
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddExpense;
