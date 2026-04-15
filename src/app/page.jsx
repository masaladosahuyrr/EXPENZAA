"use client";
import StatCard from "./components/statcard";
import SmartInsightCard from "./components/SmartInsightCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExpenseChart from "./components/ExpenseChart";
import { supabase } from "./lib/supabase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../app/lib/firebase";




const handleLogout = async () => {
  await signOut(auth);
  router.push("/signup");
};


<button onClick={handleLogout} className="primary-btn">
  Logout
</button>
/* =========================
   ADD / EDIT EXPENSE FORM
========================= */

function AddExpenseForm({ onAddExpense, editingExpense, onUpdateExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  const handleSubmit = async () => {
    if (!title || !amount || !date) return;

    if (editingExpense) {
      await onUpdateExpense({
        id: editingExpense.id,
        title,
        amount: parseFloat(amount),
        category,
        date,
      });
    } else {
      await onAddExpense({
        title,
        amount: parseFloat(amount),
        category,
        date,
      });
    }

    setTitle("");
    setAmount("");
    setCategory("Food & Dining");
    setDate("");
  };

  return (
    <motion.div
      className="card-glass form-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="section-title">
        {editingExpense ? "Edit Expense" : "Add New Expense"}
      </h3>

      <div className="form-grid">
        <input
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food & Dining</option>
          <option>Groceries</option>
          <option>Travel</option>
          <option>Transport</option>
          <option>Rent</option>
          <option>Utilities</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>Other</option>
        </select>

        <motion.button
          className="primary-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
        >
          {editingExpense ? "Update Expense" : "Add Expense"}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* =========================
   DASHBOARD PAGE
========================= */

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
const router = useRouter();

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/signup");
    }
  });

  return () => unsubscribe();
}, []);
  /* =========================
     FETCH EXPENSES
  ========================= */

  const fetchExpenses = async () => {
  const user = auth.currentUser;

  if (!user) return;

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.uid)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading expenses:", error);
  } else {
    setExpenses(data);
  }
};

  useEffect(() => {
    const fetchIncome = async () => {
      const { data } = await supabase
        .from("settings")
        .select("income")
        .eq("id", 1)
        .single();

      if (data) setIncome(data.income);
    };

    fetchExpenses();
    fetchIncome();
  }, []);

  /* =========================
     CALCULATIONS
  ========================= */

  const totalExpense = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  const balance = income - totalExpense;

  /* =========================
   FILTERED EXPENSES
========================= */

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || exp.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  /* =========================
   BUDGET USAGE
========================= */

  const budgetUsed = income > 0 ? (totalExpense / income) * 100 : 0;

  let budgetColor = "#22c55e";
  let budgetMessage = "You are spending safely.";

  if (budgetUsed >= 70 && budgetUsed < 100) {
    budgetColor = "#facc15";
    budgetMessage = "Warning: You are nearing your monthly budget.";
  }

  if (budgetUsed >= 100) {
    budgetColor = "#ef4444";
    budgetMessage = "Overspending! You exceeded your budget.";
  }

  /* =========================
     ADD EXPENSE
  ========================= */

  const addExpense = async (expense) => {
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in");
    return;
  }

  const { error } = await supabase.from("expenses").insert([
    {
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      user_id: user.uid
    },
  ]);

  if (error) {
    console.error("Insert error:", error);
  } else {
    fetchExpenses();
  }
};

  /* =========================
     UPDATE EXPENSE
  ========================= */

  const updateExpense = async (expense) => {

    const { error } = await supabase
      .from("expenses")
      .update({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
      })
      .eq("id", expense.id);

    if (!error) {
      setEditingExpense(null);
      fetchExpenses();
    }
  };

  /* =========================
     DELETE
  ========================= */

  const deleteExpense = async (id) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) fetchExpenses();
  };

  /* Greeting */

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 18
      ? "Good Afternoon 🌤"
      : "Good Evening 🌙";

  return (
    <div className="dashboard-wrapper">

      <motion.div
        className="hero-panel"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>{greeting}</h1>
        <p>Your financial system is running smoothly.</p>
      </motion.div>

      <div className="top-grid">
        <StatCard label="Income" value={income} />
        <StatCard label="Expenses" value={totalExpense} />
        <StatCard label="Balance" value={balance} />

        <SmartInsightCard
          income={income}
          expenses={totalExpense}
          balance={balance}
        />

        <motion.div
          className="card-glass"
          style={{ padding: "20px", gridColumn: "span 3" }}
        >
          <h3 className="section-title">Budget Usage</h3>

          <div
            style={{
              width: "100%",
              height: "12px",
              background: "#1e293b",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "10px",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                background: budgetColor,
                width: `${Math.min(budgetUsed, 100)}%`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <p style={{ color: budgetColor }}>
            {budgetUsed.toFixed(1)}% of your monthly income used
          </p>

          <p style={{ opacity: 0.7 }}>{budgetMessage}</p>
        </motion.div>

        {expenses.length > 0 && (
          <motion.div className="card-glass chart-wrapper">
            <h3 className="section-title">Spending Distribution</h3>
            <ExpenseChart expenses={expenses} />
          </motion.div>
        )}
      </div>

      <AddExpenseForm
        onAddExpense={addExpense}
        editingExpense={editingExpense}
        onUpdateExpense={updateExpense}
      />

      <motion.div className="card-glass table-card">

        <h3 className="section-title">All Expenses</h3>

        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>

          <input
            placeholder="Search expense..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option>Food & Dining</option>
            <option>Groceries</option>
            <option>Travel</option>
            <option>Transport</option>
            <option>Rent</option>
            <option>Utilities</option>
            <option>Shopping</option>
            <option>Entertainment</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Other</option>
          </select>

        </div>

        <table className="expense-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.title}</td>
                <td>₹ {exp.amount}</td>
                <td>{exp.category}</td>
                <td>{new Date(exp.date).toLocaleDateString()}</td>

                <td style={{ display: "flex", gap: "8px" }}>

                  <motion.button
                    className="primary-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingExpense(exp)}
                  >
                    Edit
                  </motion.button>

                  <motion.button
                    className="delete-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteExpense(exp.id)}
                  >
                    Delete
                  </motion.button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

    </div>
  );
}