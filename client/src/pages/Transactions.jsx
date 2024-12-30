import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import the autoTable plugin
import "../styles/transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const email = localStorage.getItem("email");
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/users/transactions", {
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Email": email,
      },
    })
      .then((response) => {
        const sortedTransactions = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sortedTransactions);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, [email, authToken]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to generate the transaction report as a PDF
  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    // doc.text("Transaction Report", 20, 20); // Title at the top

    const columns = ["Date", "Type", "Category", "Description", "Amount"];
    const rows = transactions.map(transaction => [
      formatDate(transaction.date),
      transaction.type,
      transaction.category,
      transaction.description,
      Number(transaction.amount).toFixed(2), // Ensure it is a number and format it
    ]);
    

// Title and header branding
const pageTitle = "Money Manager - Transaction Report";
const footerText = "© 2025 Money Manager. All Rights Reserved - Selvarjah Vinushaanth";
const additionalRights = 
  "This report is confidential and protected by intellectual property laws. Unauthorized use or distribution is strictly prohibited.";

doc.setFont("helvetica", "bold"); 
doc.setFontSize(16);
doc.setTextColor(0, 128, 255); // Blue for branding
doc.text(pageTitle, 15, 20); // Title

// Render table with color customizations
doc.autoTable({
  head: [columns],
  body: rows,
  startY: 30, // Starts below the title
  theme: "grid",
  headStyles: { fillColor: [0, 128, 255], textColor: 255 }, // Blue header with white text
  alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray for alternate rows
  styles: { halign: "center", font: "courier", fontSize: 10 },
});

// Add footer and rights section
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();

// Footer branding
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(128); // Gray text for subtle footer
doc.text(footerText, 15, pageHeight - 20); // Footer position (left)

doc.text(additionalRights, 15, pageHeight - 12, { maxWidth: pageWidth - 30 });

// Save the PDF
doc.save("Money_Manager_Transaction_Report.pdf");

  };

  return (
    <div className="dashboard">
      <div className="main-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          &#8592; Back
        </button>
        <button className="report-button" onClick={generateReport}>
          Generate Report
        </button>
        <h1>Transactions</h1>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={
                      transaction.type === "income" ? "income-row" : "expense-row"
                    }
                  >
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
