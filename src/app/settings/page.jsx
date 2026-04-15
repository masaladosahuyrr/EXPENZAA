"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function SettingsPage() {

  const [income,setIncome] = useState("");
  const [currency,setCurrency] = useState("₹");
  const [darkMode,setDarkMode] = useState(false);

  /* =========================
     LOAD SETTINGS
  ========================= */

  const loadSettings = async () => {

    const { data,error } = await supabase
      .from("settings")
      .select("*")
      .eq("id",1)
      .single()

    if(!error){
      setIncome(data.income)
      setCurrency(data.currency)
    }

  }

  useEffect(()=>{
    loadSettings()
  },[])

  /* =========================
     SAVE INCOME
  ========================= */

  const saveIncome = async () => {

    const { error } = await supabase
      .from("settings")
      .update({
        income: income,
        currency: currency
      })
      .eq("id",1)

    if(!error){
      alert("Income updated successfully")
    }

  }

  /* =========================
     CLEAR ALL EXPENSES
  ========================= */

  const clearExpenses = async () => {

    if(!confirm("Delete all expenses?")) return

    await supabase
      .from("expenses")
      .delete()
      .neq("id",0)

    alert("All expenses deleted")

  }

  /* =========================
     EXPORT CSV
  ========================= */

  const exportCSV = async () => {

    const { data } = await supabase
      .from("expenses")
      .select("*")

    let csv = "Title,Amount,Category,Date\n"

    data.forEach(e=>{
      csv += `${e.title},${e.amount},${e.category},${e.date}\n`
    })

    const blob = new Blob([csv],{type:"text/csv"})
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "expenses.csv"
    a.click()

  }

  /* =========================
     DARK MODE
  ========================= */

  const toggleDarkMode = ()=>{

    setDarkMode(!darkMode)

    if(!darkMode){
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }

  }

  return (

    <div style={{padding:"40px",maxWidth:"600px"}}>

      <h1 style={{marginBottom:"30px"}}>Settings</h1>

      {/* INCOME */}

      <h3>Monthly Income</h3>

      <input
        type="number"
        value={income}
        onChange={(e)=>setIncome(e.target.value)}
        style={{
          padding:"10px",
          width:"250px",
          marginBottom:"20px",
          borderRadius:"8px"
        }}
      />

      {/* CURRENCY */}

      <h3>Currency</h3>

      <select
        value={currency}
        onChange={(e)=>setCurrency(e.target.value)}
        style={{
          padding:"10px",
          marginBottom:"30px",
          borderRadius:"8px"
        }}
      >
        <option value="₹">₹ INR</option>
        <option value="$">$ USD</option>
        <option value="€">€ EUR</option>
      </select>

      <br/>

      {/* SAVE BUTTON */}

      <motion.button
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}
        onClick={saveIncome}
        style={{
          background:"#22c55e",
          color:"white",
          padding:"12px 20px",
          border:"none",
          borderRadius:"8px",
          marginRight:"10px",
          cursor:"pointer"
        }}
      >
        Save Income
      </motion.button>

      {/* DARK MODE */}

      <motion.button
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}
        onClick={toggleDarkMode}
        style={{
          background:"#6366f1",
          color:"white",
          padding:"12px 20px",
          border:"none",
          borderRadius:"8px",
          marginRight:"10px",
          cursor:"pointer"
        }}
      >
        Toggle Dark Mode
      </motion.button>

      {/* EXPORT */}

      <motion.button
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}
        onClick={exportCSV}
        style={{
          background:"#06b6d4",
          color:"white",
          padding:"12px 20px",
          border:"none",
          borderRadius:"8px",
          marginRight:"10px",
          cursor:"pointer"
        }}
      >
        Export Data
      </motion.button>

      {/* CLEAR */}

      <motion.button
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}
        onClick={clearExpenses}
        style={{
          background:"#ef4444",
          color:"white",
          padding:"12px 20px",
          border:"none",
          borderRadius:"8px",
          cursor:"pointer"
        }}
      >
        Clear All Expenses
      </motion.button>

    </div>
  )
}