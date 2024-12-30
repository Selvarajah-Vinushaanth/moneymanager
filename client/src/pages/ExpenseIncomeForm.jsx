import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaCalendarAlt, FaDollarSign, FaTags, FaPen } from 'react-icons/fa';
import "../styles/ExpenseIncomeForm.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function ExpenseIncomeForm() {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income'); // 'income' or 'expense'
  const [category, setCategory] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate hook

  const email = localStorage.getItem('email'); // Assuming the email is stored with key 'userEmail'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('User email is missing. Please log in first.');
      return;
    }

    const transactionData = {
      email,
      date,
      description,
      amount: parseFloat(amount),
      type,
      category,
    };

    try {
      // Sending data to backend
      await axios.post('http://localhost:5000/users/transaction', transactionData);

      toast.success("Data added successfully", {
        position: "top-center",
        style: {
          background: "green",
          color: "white",
        },
        duration: 3000, // Duration of 3 seconds for the toast
      });

      // Reset fields after successful submission
      setDate('');
      setDescription('');
      setAmount('');
      setCategory('');
      setType('income'); // Reset to default value

      // Navigate to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/dashboard");  // Redirect to dashboard page
      }, 3000);

    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Error adding transaction', {
        position: "top-center",
        duration: 3000,
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Enter Your Expense/Income</h2>
      <form onSubmit={handleSubmit} className="table-form">
        <div className="form-row">
          <div className="form-group">
            <label style={{color:"black"}}>
              <FaCalendarAlt /> Date:
            </label>
            <input
              type="date"
              
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label style={{color:"black"}}>
              <FaPen /> Description:
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label style={{color:"black"}}>
              <FaDollarSign /> Amount:
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label style={{color:"black"}}>
              <FaTags /> Type:
            </label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label style={{color:"black"}}>
              <FaTags /> Category:
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit">
          <FaPlus /> Submit
        </button>
      </form>

      <Toaster /> {/* Include the Toaster component to display toast notifications */}
    </div>
  );
}

export default ExpenseIncomeForm;
