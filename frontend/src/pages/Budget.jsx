import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Budget() {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentDate = new Date();

  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [amount, setAmount] = useState("");

  const [budgetData, setBudgetData] = useState({
    budget: 0,
    totalSpent: 0,
    remaining: 0,
    percentageUsed: 0,
    status: "No Budget"
  });

  const fetchBudget = async () => {
    if (!user?._id) return;

    try {
      const response = await axios.get(
        `${API_URL}/budget/${user._id}/${month}/${year}`
      );

      setBudgetData(response.data);
      setAmount(response.data.budget || "");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [month, year]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid budget amount");
      return;
    }

    try {
      await axios.post(`${API_URL}/budget`, {
        userId: user._id,
        month,
        year,
        amount: Number(amount)
      });

      alert("Budget saved successfully");
      fetchBudget();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to save budget"
      );
    }
  };

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div>
      <Navbar />

      <div className="main-container">
        <Sidebar />

        <main className="content">
          <div className="page-header">
            <div>
              <h1>Budget Management</h1>
              <p>Set and monitor your monthly budget</p>
            </div>
          </div>

          <div className="budget-controls">
            <div className="form-group">
              <label>Select Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">September</option>
                <option value="9">October</option>
                <option value="10">November</option>
                <option value="11">December</option>
              </select>
            </div>

            <div className="form-group">
              <label>Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          <div className="budget-form-card">
            <h2>Set Monthly Budget</h2>

            <form onSubmit={handleSubmit} className="budget-form">
              <input
                type="number"
                placeholder="Enter budget amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />

              <button type="submit" className="primary-button">
                Save Budget
              </button>
            </form>
          </div>

          <div className="budget-summary">
            <div className="budget-card">
              <h3>Monthly Budget</h3>
              <p>{money(budgetData.budget)}</p>
            </div>

            <div className="budget-card">
              <h3>Total Spent</h3>
              <p>{money(budgetData.totalSpent)}</p>
            </div>

            <div className="budget-card">
              <h3>Remaining</h3>
              <p>{money(budgetData.remaining)}</p>
            </div>

            <div className="budget-card">
              <h3>Usage</h3>
              <p>{budgetData.percentageUsed}%</p>
            </div>
          </div>

          <div className="budget-progress-card">
            <div className="progress-header">
              <h2>Budget Usage</h2>
              <span>{budgetData.percentageUsed}%</span>
            </div>

            <div className="progress-bar">
              <div
                className={
                  budgetData.status === "Exceeded"
                    ? "progress-fill exceeded"
                    : budgetData.status === "Warning"
                    ? "progress-fill warning"
                    : "progress-fill"
                }
                style={{
                  width: `${Math.min(
                    budgetData.percentageUsed,
                    100
                  )}%`
                }}
              />
            </div>

            <div className="budget-status">
              {budgetData.status === "Exceeded" && (
                <p className="status-danger">
                  ⚠ Budget exceeded by{" "}
                  {money(Math.abs(budgetData.remaining))}
                </p>
              )}

              {budgetData.status === "Warning" && (
                <p className="status-warning">
                  ⚠ You have used more than 80% of your budget.
                </p>
              )}

              {budgetData.status === "Within Budget" && (
                <p className="status-success">
                  ✓ You are within your monthly budget.
                </p>
              )}

              {budgetData.status === "No Budget" && (
                <p className="status-warning">
                  Set a budget to start tracking your spending.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Budget;
