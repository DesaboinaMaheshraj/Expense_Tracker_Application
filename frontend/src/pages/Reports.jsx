import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Reports() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [report, setReport] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    monthlyReport: [],
    categoryReport: []
  });

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(
          `${API_URL}/reports/${user._id}`
        );

        setReport(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReports();
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
              <h1>Financial Reports</h1>
              <p>Analyze your income and expenses</p>
            </div>
          </div>

          <div className="summary-cards">
            <div className="card">
              <h3>Total Income</h3>
              <p>{money(report.totalIncome)}</p>
            </div>

            <div className="card">
              <h3>Total Expenses</h3>
              <p>{money(report.totalExpenses)}</p>
            </div>

            <div className="card">
              <h3>Balance</h3>
              <p>{money(report.balance)}</p>
            </div>
          </div>

          <div className="chart-card">
            <h2>Monthly Income vs Expenses</h2>

            {report.monthlyReport.length === 0 ? (
              <p>No financial data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={report.monthlyReport}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#2563eb"
                  />

                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#dc2626"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <h2>Expenses by Category</h2>

            {report.categoryReport.length === 0 ? (
              <p>No expense data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={report.categoryReport}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    label
                  >
                    {report.categoryReport.map(
                      (item, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#2563eb",
                              "#16a34a",
                              "#f59e0b",
                              "#dc2626",
                              "#9333ea",
                              "#0891b2",
                              "#ea580c",
                              "#4f46e5",
                              "#65a30d"
                            ][index % 9]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="dashboard-section">
            <h2>Category Summary</h2>

            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {report.categoryReport.map((item) => (
                  <tr key={item.category}>
                    <td>{item.category}</td>
                    <td>{money(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reports;
