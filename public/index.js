
      const form = document.getElementById("expenseForm");
      const expenseList = document.getElementById("expenseList");
      let editingExpensesId = null;

      async function getExpenses() {
        const response = await fetch("/api/expenses");
        if (response.ok) {
          const expenses = await response.json();
          renderExpenses(expenses);
        }
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const amount = parseFloat(document.getElementById("amount").value);

        if (editingExpensesId) {
          await updateExpense(editingExpensesId, description, amount);
          editingExpensesId = null;
        } else {
          await addExpense(description, amount);
        }
        getExpenses();
        form.reset();
      });

      async function addExpense(description, amount) {
        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description, amount }),
        });
        if (!response.ok) {
          console.error("Fail to add expense");
        }
      }
      async function deleteExpense(id) {
        await fetch(`/api/expenses/${id}`, { method: "DELETE" });
        getExpenses();
      }

      async function updateExpense(id, description, amount) {
        await fetch(`/api/expenses/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description, amount }),
        });
      }

      function renderExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach((expense) => {
          const li = document.createElement("li");
          li.id = expense._id;
          li.innerHTML = `
              ${expense.description}: $${expense.amount.toFixed(2)}
              <button onclick="deleteExpense('${expense._id}')">Delete</button>
              <button onclick="editExpense('${expense._id}', '${
            expense.description
          }', ${expense.amount})">Edit</button>
            `;
          expenseList.appendChild(li);
        });
      }
      function editExpense(id, description, amount) {
        document.getElementById("description").value = description;
        document.getElementById("amount").value = amount;
        editingExpensesId = id;
      }

      getExpenses();
  