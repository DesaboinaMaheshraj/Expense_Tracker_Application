import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    thisMonthExpenses: 0,
    recentExpenses: [],
    recentIncome: []
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(
          `${API_URL}/dashboard/${user._id}`
        );

        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
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
              <h1>Dashboard</h1>
              <p>Overview of your finances</p>
            </div>
          </div>

          <div className="summary-cards">
            <div className="card">
              <h3>Total Income</h3>
              <p>{money(data.totalIncome)}</p>
            </div>

            <div className="card">
              <h3>Total Expenses</h3>
              <p>{money(data.totalExpenses)}</p>
            </div>

            <div className="card">
              <h3>Balance</h3>
              <p>{money(data.balance)}</p>
            </div>

            <div className="card">
              <h3>This Month</h3>
              <p>{money(data.thisMonthExpenses)}</p>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Recent Expenses</h2>

            {data.recentExpenses.length === 0 ? (
              <p>No expenses found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {data.recentExpenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.title}</td>
                      <td>{expense.category}</td>
                      <td>{money(expense.amount)}</td>
                      <td>
                        {new Date(expense.date).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="dashboard-section">
            <h2>Recent Income</h2>

            {data.recentIncome.length === 0 ? (
              <p>No income found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {data.recentIncome.map((item) => (
                    <tr key={item._id}>
                      <td>{item.source}</td>
                      <td>{item.description}</td>
                      <td>{money(item.amount)}</td>
                      <td>
                        {new Date(item.date).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
