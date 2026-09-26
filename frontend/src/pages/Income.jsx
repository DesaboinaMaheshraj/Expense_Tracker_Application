import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Income() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [income, setIncome] = useState([]);

  const fetchIncome = async () => {
    if (!user?._id) return;

    try {
      const response = await axios.get(
        `${API_URL}/income/user/${user._id}`
      );

      setIncome(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [user?._id]);

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
              <h1>Income</h1>
              <p>Manage your income</p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/add-income")}
            >
              Add Income
            </button>
          </div>

          <div className="dashboard-section">
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {income.map((item) => (
                  <tr key={item._id}>
                    <td>{item.source}</td>
                    <td>{money(item.amount)}</td>
                    <td>{item.description}</td>
                    <td>
                      {new Date(item.date).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {income.length === 0 && (
              <p className="empty-state">
                No income found.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Income;
