import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, PolarAreaController, DoughnutController, Title, Tooltip, Legend } from "chart.js";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom"; 
import "font-awesome/css/font-awesome.min.css"; 

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement, // Required for Pie chart
  RadialLinearScale, // For Radar and Polar charts
  PolarAreaController, // Required for PolarArea chart
  DoughnutController, // Required for Doughnut chart
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [income, setIncome] = useState([]);
  const [outcome, setOutcome] = useState([]);
  const [balance, setBalance] = useState([]);
  const [lineData, setLineData] = useState([]);
  const navigate = useNavigate();  // Initialize useNavigate hook
  const [transactions, setTransactions] = useState([]); // Initialize as an empty array
// Initialize chartData state


  // Retrieve the email and JWT from localStorage
  const email = localStorage.getItem("email");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    // Fetch dashboard data, passing email and token in the headers
    axios.get("http://localhost:5000/users/dashboard", {
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Email": email,
      },
    })
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
      axios.get("http://localhost:5000/users/balances", {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Email": email,
        },
      })
        .then((response) => {
          setBalance(response.data);
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
        });

        axios.get("http://localhost:5000/users/total-expenses", {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Email": email,
          },
        })
          .then((response) => {
            setOutcome(response.data);
          })
          .catch((error) => {
            console.error("Error fetching dashboard data:", error);
          });
    // Fetch revenue data
    axios.get("http://localhost:5000/users/total-income", {
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Email": email,
      },
    })
      .then((response) => {
        setIncome(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
    axios.get("http://localhost:5000/users/revenue", {
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Email": email,
      },
    })
      .then((response) => {
        setRevenueData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching revenue data:", error);
      });

      axios.get("http://localhost:5000/users/income", {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Email": email,
        },
      })
        .then((response) => {
          setIncomeData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching Income data:", error);
        });
  

    // Fetch expenses data
    axios.get("http://localhost:5000/users/expenses", {
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Email": email,
      },
    })
      .then((response) => {
        setExpensesData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching expenses data:", error);
      });

    // Fetch transactions data
    axios.get("http://localhost:5000/users/transactions", {
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Email": email,
      },
    })
      .then((response) => {
        setTransactionsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transactions data:", error);
      });
      axios.get("http://localhost:5000/users/balance", {
        headers: {
          "Authorization": `Bearer ${authToken}`,  // Include the auth token
          "Email": email,  // Include the email in headers
        },
      })
        .then((response) => {
          const data = response.data;  // Data returned from the backend
    
          // Prepare chart data
          // const chartData = {
          //   labels: data.map(item => `Month ${item.month}`),
          //   datasets: [
          //     {
          //       label: 'Balance',
          //       data: data.map(item => item.amount),
          //       borderColor: 'rgba(75, 192, 192, 1)',
          //       backgroundColor: 'rgba(75, 192, 192, 0.2)',
          //       fill: true,
          //     },
          //   ],
          // };
    
          setLineData(data);  // Update chart data in state
        })
        .catch((error) => {
          console.error("Error fetching balance data:", error);
        });
        axios.get("http://localhost:5000/users/transactions", {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Email": email,
          },
        })
          .then((response) => {
            // Sort transactions by date in descending order (most recent first)
            const sortedTransactions = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(sortedTransactions);  // Update the state with sorted transactions
          })
          .catch((error) => {
            console.error("Error fetching transactions:", error);
          });
  }, [email, authToken]);

 // Prepare chart data
// Prepare chart data
const lineDatas = {
  labels: lineData.map(item => item.month),
  datasets: [
    {
      label: "Revenue",
      data: lineData.map(item => item.amount),
      borderColor: lineData.map((item, index) => {
        // If it's the first item, no previous data to compare with
        if (index === 0) return "green"; // Default to green for the first entry
        return item.amount > lineData[index - 1].amount ? "green" : "red"; // Green for increase, red for decrease
      }),
      backgroundColor: 'transparent', // No background color
      fill: false, // Do not fill under the line
      borderWidth: 2, // Line width
    },
  ],
};


  

  function getQuarter(date) {
    const month = new Date(date).getMonth() + 1; // Month is 0-indexed, so adding 1
    if (month <= 3) return 'Q1';
    if (month <= 6) return 'Q2';
    if (month <= 9) return 'Q3';
    return 'Q4';
  }
  
  // Group expenses by quarter and sum the amounts
  const groupedData = expensesData.reduce((acc, item) => {
    const quarter = getQuarter(item.date);
    if (acc[quarter]) {
      acc[quarter] += parseFloat(item.amount);
    } else {
      acc[quarter] = parseFloat(item.amount);
    }
    return acc;
  }, {});
  
  // Prepare the data for the bar chart
  const barData = {
    labels: Object.keys(groupedData), // Get the unique quarters (Q1, Q2, Q3, Q4)
    datasets: [
      {
        label: "Expenses",
        data: Object.values(groupedData), // Get the summed amounts for each quarter
        backgroundColor: "red",
      },
    ],
  };


  const groupedData2 = incomeData.reduce((acc, item) => {
    const quarter = getQuarter(item.date);
    if (acc[quarter]) {
      acc[quarter] += parseFloat(item.amount);
    } else {
      acc[quarter] = parseFloat(item.amount);
    }
    return acc;
  }, {});
  
  // Prepare the data for the bar chart
  const barData2 = {
    labels: Object.keys(groupedData2), // Get the unique quarters (Q1, Q2, Q3, Q4)
    datasets: [
      {
        label: "Income",
        data: Object.values(groupedData2), // Get the summed amounts for each quarter
        backgroundColor: "green",
      },
    ],
  };


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  const pieData = {
    labels: transactionsData.map(item => item.category),
    datasets: [
      {
        label: "Transaction Categories",
        data: transactionsData.reduce((acc, item) => {
          const index = acc.findIndex((category) => category.name === item.category);
          if (index === -1) {
            acc.push({ name: item.category, amount: item.amount });
          } else {
            acc[index].amount += item.amount;
          }
          return acc;
        }, []).map((category) => category.amount),
        backgroundColor: [
          "rgba(0, 0, 0, 0.8)",      // Black
  "rgba(34, 34, 34, 0.8)",   // Dark gray
  "rgba(52, 73, 94, 0.8)",   // Dark blue (Midnight)
  "rgba(44, 62, 80, 0.8)",   // Charcoal
  "rgba(102, 51, 153, 0.8)", // Dark purple
  "rgba(231, 76, 60, 0.8)",  // Dark red (Alizarin)
  "rgba(39, 174, 96, 0.8)",  // Dark green (Seaweed)
  "rgba(155, 89, 182, 0.8)", // Dark violet (Amethyst)
  "rgba(22, 160, 133, 0.8)", // Teal (Dark)
  "rgba(241, 196, 15, 0.8)", // Dark yellow (Golden)
        ]
        
      },
      
    ],
    // options: {
    //   responsive: true, // Enable responsive behavior
    //   maintainAspectRatio: false, // Allow it to resize freely
    // },
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);  // Convert to Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
  };
  const handleLogout = () => {
    // Remove email and authToken from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("authToken");

    // Redirect the user to the login page after logging out
    navigate("/login");  // Use navigate to programmatically redirect
  };

 

  return (
    <div className="dashboard">
        <div className="sidebar">
        <ul className="logout-link">
          {/* <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/transactions">Transactions</a></li>
          <li><a href="/profile">Profile</a></li> */}
          <li><a href="/addentry" ><i className="fa fa-plus"></i> Add Entry</a></li>
          
        </ul>
        <h2>Recent Transactions</h2>

        
      
      <div className="transaction-table">
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          {/* <th>Category</th> */}
          {/* <th>Description</th> */}
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.slice(0,5).map((transaction, index) => (
          <tr
            key={index}
            className={transaction.type === "income" ? "income-row" : "expense-row"}
          >
            <td>{formatDate(transaction.date)}</td>
            <td>{transaction.type}</td>
            {/* <td>{transaction.category}</td> */}
            {/* <td>{transaction.description}</td> */}
            <td>{transaction.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
    
    </div>
    <ul className="logout-link">
    <li><a href="/login" onClick={handleLogout}>Logout <i className="fa fa-sign-out" aria-hidden="true"></i></a></li>
  </ul>
  </div>
      
      <div className="main-content">
        <div className="headers">
          <h1>Dashboard Overview</h1>
          
          
          <button
  className="back-button"
  onClick={() => navigate("/transactions")} // Navigate to the login page
>
  &#8594; View Transactions
</button>

          <button
          className="back-button"
          onClick={() => navigate("/login")} // Navigate back to the previous page
        >
          &#8592; Back
        </button>
        </div>
        <div className="cards">
  <div className="card">
    {/* <h3>Total Balance</h3> */}
    <h3>Total Balance</h3>
    <p
      style={{
        color: balance.balance >= 0 ? "green" : "red", // Green if balance is positive, red if negative
      }}
    >
      Rs{balance.balance}
    </p>
  </div>
  <div className="card">
    <h3>Income This Month</h3>
    <p className="income-text" style={{color:'green'}}>Rs{income.total_income}</p> {/* Green for Income */}
  </div>
  <div className="card">
    <h3>Expenditure</h3>
    <p className="expense-text" style={{color:'red'}}>Rs{outcome.total_expenses}</p> {/* Red for Expenditure */}
  </div>
</div>

        <div className="charts">
          
        <div className="chart-card">
            <h3>Quarterly Expenses</h3>
            <Bar data={barData}  />
          </div>
          <div className="chart-card">
            <h3>Quarterly Income</h3>
            <Bar data={barData2} />
          </div>
          <div className="chart-card">
            <h3>Transaction Categories</h3>
            <Pie data={pieData} />
          </div>
          <div className="chart-card">
            <h3>Revenue Overview</h3>
            <Line data={lineDatas} />
          </div>
          {/* <div className="chart-card">
            <h3>Performance Overview</h3>
            <Radar data={radarData} />
          </div>
          <div className="chart-card">
            <h3>Category Distribution</h3>
            <Doughnut data={doughnutData} />
          </div>
          <div className="chart-card">
            <h3>Polar Area Overview</h3>
            <PolarArea data={polarAreaData} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
