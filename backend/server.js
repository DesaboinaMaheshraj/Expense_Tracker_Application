const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User");
const Expense = require("./models/Expense");
const Income = require("./models/Income");
const Budget = require("./models/Budget");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) =>
    console.log("MongoDB connection error:", error.message)
  );

app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running" });
});

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      message: "Registration successful",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

// LOGIN - intentionally no authentication/JWT
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

// EXPENSES
app.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({
      message: "Expense added successfully",
      expense
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add expense",
      error: error.message
    });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expenses",
      error: error.message
    });
  }
});

app.get("/expenses/user/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.params.userId
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expenses",
      error: error.message
    });
  }
});

app.get("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expense",
      error: error.message
    });
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      message: "Expense updated successfully",
      expense
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update expense",
      error: error.message
    });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      message: "Expense deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete expense",
      error: error.message
    });
  }
});

// INCOME
app.post("/income", async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();

    res.status(201).json({
      message: "Income added successfully",
      income
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add income",
      error: error.message
    });
  }
});

app.get("/income/user/:userId", async (req, res) => {
  try {
    const income = await Income.find({
      userId: req.params.userId
    }).sort({ date: -1 });

    res.json(income);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch income",
      error: error.message
    });
  }
});

// DASHBOARD
app.get("/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const [expenses, income] = await Promise.all([
      Expense.find({ userId }).sort({ date: -1 }),
      Income.find({ userId }).sort({ date: -1 })
    ]);

    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    const totalIncome = income.reduce(
      (total, item) => total + item.amount,
      0
    );

    const balance = totalIncome - totalExpenses;
    const now = new Date();

    const thisMonthExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((total, expense) => total + expense.amount, 0);

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      thisMonthExpenses,
      recentExpenses: expenses.slice(0, 5),
      recentIncome: income.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message
    });
  }
});

// BUDGET
app.post("/budget", async (req, res) => {
  try {
    const { userId, month, year, amount } = req.body;

    if (!userId || month === undefined || !year || !amount) {
      return res.status(400).json({
        message: "All budget fields are required"
      });
    }

    const existingBudget = await Budget.findOne({
      userId,
      month,
      year
    });

    if (existingBudget) {
      existingBudget.amount = Number(amount);
      await existingBudget.save();

      return res.json({
        message: "Budget updated successfully",
        budget: existingBudget
      });
    }

    const budget = new Budget({
      userId,
      month,
      year,
      amount: Number(amount)
    });

    await budget.save();

    res.status(201).json({
      message: "Budget created successfully",
      budget
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save budget",
      error: error.message
    });
  }
});

app.get("/budget/:userId/:month/:year", async (req, res) => {
  try {
    const { userId, month, year } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    const monthNumber = Number(month);
    const yearNumber = Number(year);

    const budget = await Budget.findOne({
      userId,
      month: monthNumber,
      year: yearNumber
    });

    const startDate = new Date(yearNumber, monthNumber, 1);
    const endDate = new Date(yearNumber, monthNumber + 1, 1);

    const expenses = await Expense.find({
      userId,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    const totalSpent = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    const budgetAmount = budget ? budget.amount : 0;
    const remaining = budgetAmount - totalSpent;

    const percentageUsed =
      budgetAmount > 0
        ? (totalSpent / budgetAmount) * 100
        : 0;

    let status = "No Budget";

    if (budgetAmount > 0) {
      if (percentageUsed > 100) {
        status = "Exceeded";
      } else if (percentageUsed >= 80) {
        status = "Warning";
      } else {
        status = "Within Budget";
      }
    }

    res.json({
      budget: budgetAmount,
      totalSpent,
      remaining,
      percentageUsed: Number(percentageUsed.toFixed(2)),
      status,
      expenses
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load budget",
      error: error.message
    });
  }
});

// REPORTS
app.get("/reports/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    const expenses = await Expense.find({
      userId
    }).sort({ date: 1 });

    const income = await Income.find({
      userId
    }).sort({ date: 1 });

    const totalIncome = income.reduce(
      (total, item) => total + item.amount,
      0
    );

    const totalExpenses = expenses.reduce(
      (total, item) => total + item.amount,
      0
    );

    const balance = totalIncome - totalExpenses;

    const monthlyData = {};

    income.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: key,
          income: 0,
          expenses: 0
        };
      }

      monthlyData[key].income += item.amount;
    });

    expenses.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: key,
          income: 0,
          expenses: 0
        };
      }

      monthlyData[key].expenses += item.amount;
    });

    const monthlyReport = Object.values(monthlyData).sort(
      (a, b) => a.month.localeCompare(b.month)
    );

    const categoryData = {};

    expenses.forEach((expense) => {
      if (!categoryData[expense.category]) {
        categoryData[expense.category] = 0;
      }

      categoryData[expense.category] += expense.amount;
    });

    const categoryReport = Object.entries(categoryData).map(
      ([category, amount]) => ({
        category,
        amount
      })
    );

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      monthlyReport,
      categoryReport
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate reports",
      error: error.message
    });
  }
});

// PROFILE
app.put("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered"
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
