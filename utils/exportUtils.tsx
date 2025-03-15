import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { ExpenseEntry } from '@/store/entriesStore';
import * as FileSystem from 'expo-file-system';

export async function generateCSV(expenseList: ExpenseEntry[], startDate: Date, endDate: Date) {
    if (!expenseList || expenseList.length === 0) {
      alert("No expenses to export.");
      return;
    }
  
    // Convert Date objects to comparable values
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999); // full day
  
    // Filter expenses within the date range
    const filteredExpenses = expenseList.filter(expense => {
      const expenseDate = new Date(expense.date).setHours(0, 0, 0, 0);
      return expenseDate >= start && expenseDate <= end;
    });
  
    if (filteredExpenses.length === 0) {
      alert("No expenses found in the selected date range.");
      return;
    }
  
    const reportDate = new Date().toLocaleDateString("en-US");
    const formattedStartDate = new Date(startDate).toLocaleDateString("en-US");
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-US");
  
    // Helper to format numbers as currency (for display in the CSV)
    const formatCurrency = (num: number) =>
      `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
    // Group expenses by month
    const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthKey = date.toLocaleString("en-US", { month: "long", year: "numeric" });
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(expense);
      return acc;
    }, {} as Record<string, ExpenseEntry[]>);
  
    // Sort each month's expenses by date
    Object.keys(groupedExpenses).forEach(month => {
      groupedExpenses[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  
    // Calculate overall totals
    let grandSubtotal = 0;
    let grandTax = 0;
    let grandTotal = 0;
  
    // Build the CSV content string
    let csvContent = `Expense Report - ${reportDate}\n`;
    csvContent += `Date Range: ${formattedStartDate} to ${formattedEndDate}\n\n`;
  
    for (const month of Object.keys(groupedExpenses)) {
      let monthlySubtotal = 0;
      let monthlyTax = 0;
      let monthlyTotal = 0;
  
      csvContent += `${month}\n`;
      csvContent += "Date,Category,Subtotal,HST / GST,Total\n";
  
      for (const expense of groupedExpenses[month]) {
        monthlySubtotal += expense.subtotal;
        monthlyTax += expense.hst;
        monthlyTotal += expense.total;
  
        csvContent += `${new Date(expense.date).toLocaleDateString("en-US")},` +
                      `"${expense.category}",` +
                      `${formatCurrency(expense.subtotal)},` +
                      `${formatCurrency(expense.hst)},` +
                      `${formatCurrency(expense.total)}\n`;
      }
  
      csvContent += `Monthly Total,,${formatCurrency(monthlySubtotal)},${formatCurrency(monthlyTax)},${formatCurrency(monthlyTotal)}\n\n`;
  
      grandSubtotal += monthlySubtotal;
      grandTax += monthlyTax;
      grandTotal += monthlyTotal;
    }
  
    csvContent += "Grand Totals\n";
    csvContent += `Overall Total,,${formatCurrency(grandSubtotal)},${formatCurrency(grandTax)},${formatCurrency(grandTotal)}\n`;
  
    // Log CSV for debugging
    // console.log(csvContent);
  
    // Define a file path in the app's document directory
    const fileUri = FileSystem.documentDirectory + "expense_report.csv";
  
    try {
      // Write the CSV content to the file
      await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
      // Share the CSV file; Excel can open a CSV file if it's shared with the right MIME type.
      await shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Share Expense Report (CSV)",
        UTI: "public.comma-separated-values-text"
      });
    } catch (error) {
      console.error("CSV Generation Error:", error);
    }
}

export async function generatePDF(expenseList: ExpenseEntry[], startDate: Date, endDate: Date) {
    if (!expenseList || expenseList.length === 0) {
        alert("No expenses to export.");
        return;
    }
    // Convert Date objects to comparable values
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999); // Include full day
    // Filter expenses within the date range
    const filteredExpenses = expenseList.filter(expense => {
        const expenseDate = new Date(expense.date).setHours(0, 0, 0, 0);
        return expenseDate >= start && expenseDate <= end;
    });
    
    if (filteredExpenses.length === 0) {
        alert("No expenses found in the selected date range.");
        return;
    }

    const reportDate = new Date().toLocaleDateString("en-US");
    const formattedStartDate = new Date(startDate).toLocaleDateString("en-US");
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-US");
    // format numbers with thousands separators & 2 decimal places
    const formatCurrency = (num: number) => `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const monthKey = date.toLocaleString("en-US", { month: "long", year: "numeric" }); // "February 2025"
        
        if (!acc[monthKey]) {
            acc[monthKey] = [];
        }
        acc[monthKey].push(expense);
        return acc;
    }, {} as Record<string, typeof filteredExpenses>);
    
    // Sorting each month's expenses by date
    Object.keys(groupedExpenses).forEach(month => {
        groupedExpenses[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
    
    // Calculate overall totals
    let grandSubtotal = 0;
    let grandTax = 0;
    let grandTotal = 0;
    
    const html = `<html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                p { text-align: center; font-size: 16px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; background-color: #ffffff; margin-top: 10px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: center; font-size: 14px; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .total-row { font-weight: bold; font-size: 16px; }
                .month-title { text-align: left; font-size: 18px; font-weight: bold; margin-top: 20px; }
            </style>
        </head>
        <body>
            <p><strong>Expense Report - ${reportDate}</strong></p>
            <p><strong>Date Range: ${formattedStartDate} to ${formattedEndDate}</strong></p>
            ${Object.keys(groupedExpenses).map(month => {
                let monthlySubtotal = 0;
                let monthlyTax = 0;
                let monthlyTotal = 0;
    
                const monthTable = groupedExpenses[month].map(expense => {
                    monthlySubtotal += expense.subtotal;
                    monthlyTax += expense.hst;
                    monthlyTotal += expense.total;
                    
                    return `
                        <tr>
                            <td>${new Date(expense.date).toLocaleDateString("en-US")}</td>
                            <td>${expense.category}</td>
                            <td>${formatCurrency(expense.subtotal)}</td>
                            <td>${formatCurrency(expense.hst)}</td>
                            <td>${formatCurrency(expense.total)}</td>
                        </tr>
                    `;
                }).join("");
    
                // Accumulate for grand totals
                grandSubtotal += monthlySubtotal;
                grandTax += monthlyTax;
                grandTotal += monthlyTotal;
    
                return `
                    <p class="month-title">${month}</p>
                    <table>
                        <tr>
                            <th style="width: 20%;">Date</th>
                            <th style="width: 40%;">Category</th>
                            <th style="width: 15%;">Subtotal</th>
                            <th style="width: 15%;">HST / GST</th>
                            <th style="width: 15%;">Total</th>
                        </tr>
                        ${monthTable}
                        <tr>
                            <td colspan="2" class="total-row" style="text-align: right;"><strong>Monthly Total:</strong></td>
                            <td class="total-row">${formatCurrency(monthlySubtotal)}</td>
                            <td class="total-row">${formatCurrency(monthlyTax)}</td>
                            <td class="total-row">${formatCurrency(monthlyTotal)}</td>
                        </tr>
                    </table>
                `;
            }).join("")}
            <hr>
            <p class="month-title">Grand Totals</p>
            <table>
                <tr>
                    <td colspan="2" class="total-row" style="text-align: right;"><strong>Overall Total:</strong></td>
                    <td class="total-row">${formatCurrency(grandSubtotal)}</td>
                    <td class="total-row">${formatCurrency(grandTax)}</td>
                    <td class="total-row">${formatCurrency(grandTotal)}</td>
                </tr>
            </table>
        </body>
    </html>`;
    

    try {
        // generate PDF
        const { uri } = await printToFileAsync({ html, base64: false });
        // share the PDF
        await shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: "Share Expense Report",
        });
    } catch (error) {
        console.error("PDF Generation Error:", error);
    }
}