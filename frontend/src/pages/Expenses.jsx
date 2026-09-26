import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Expenses() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const fetchExpenses = async () => {
    if (!user?._id) return;

    try {
      const response = await axios.get(
        `${API_URL}/expenses/user/${user._id}`
      );

      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user?._id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      alert("Failed to delete expense");
    }
  };

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      !category || expense.category === category;

    const matchesPayment =
      !paymentMethod ||
      expense.paymentMethod === paymentMethod;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPayment
    );
  });

  return (
    <div>
      <Navbar />

      <div className="main-container">
        <Sidebar />

        <main className="content">
          <div className="page-header">
            <div>
              <h1>Expenses</h1>
              <p>Manage your expenses</p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/add-expense")}
            >
              Add Expense
            </button>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Search expense..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
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

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">All Payment Methods</option>
              <option>Cash</option>
              <option>UPI</option>
              <option>Debit Card</option>
              <option>Credit Card</option>
              <option>Net Banking</option>
            </select>
          </div>

          <div className="dashboard-section">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.title}</td>
                    <td>{money(expense.amount)}</td>
                    <td>{expense.category}</td>
                    <td>{expense.paymentMethod}</td>
                    <td>
                      {new Date(expense.date).toLocaleDateString("en-IN")}
                    </td>
                    <td>
                      <button
                        className="danger-button"
                        onClick={() => handleDelete(expense._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredExpenses.length === 0 && (
              <p className="empty-state">
                No expenses found.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Expenses;
