let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    document.addEventListener("DOMContentLoaded", () => {
        renderTable();
        updateSummary();
        renderChart();
    });

    function addExpense() {
        const title = document.getElementById("title").value.trim();
        const amount = Number(document.getElementById("amount").value);
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;

        if (!title || !amount || !date) {
            alert("Please fill out all fields.");
            return;
        }

        const expense = { id: Date.now(), title, amount, category, date };
        expenses.push(expense);

        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderTable();
        updateSummary();
        renderChart();

        document.getElementById("title").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("date").value = "";
    }

    function removeExpense(id) {
        expenses = expenses.filter(e => e.id !== id);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderTable();
        updateSummary();
        renderChart();
    }

    function renderTable() {
        const table = document.getElementById("expenseTable");
        table.innerHTML = "";

        expenses.forEach(exp => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${exp.title}</td>
                <td>$${exp.amount.toFixed(2)}</td>
                <td>${exp.category}</td>
                <td>${exp.date}</td>
                <td><button class="remove-btn" onclick="removeExpense(${exp.id})">X</button></td>
            `;
            table.appendChild(tr);
        });
    }

    function updateSummary() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const monthlyExpenses = expenses.filter(e => {
            const d = new Date(e.date);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
        });

        const total = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

        document.getElementById("monthlyTotal").innerText =
            `Total spending for ${now.toLocaleString('default', { month: 'long' })}: $${total.toFixed(2)}`;
    }

    // Basic Bar Chart (Responsive)
    function renderChart() {
        const canvas = document.getElementById("chart");
        const ctx = canvas.getContext("2d");

        canvas.width = canvas.clientWidth;
        canvas.height = 250;

        const categories = {};
        expenses.forEach(e => categories[e.category] = (categories[e.category] || 0) + e.amount);

        const keys = Object.keys(categories);
        const values = Object.values(categories);

        const maxValue = Math.max(...values, 50);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        keys.forEach((cat, i) => {
            const barWidth = 45;
            const gap = 30;
            const x = i * (barWidth + gap) + 40;
            const barHeight = (values[i] / maxValue) * 200;

            ctx.fillStyle = "#3b82f6";
            ctx.fillRect(x, canvas.height - barHeight - 20, barWidth, barHeight);

            ctx.fillStyle = "#fff";
            ctx.font = "13px Poppins";
            ctx.fillText(cat, x, canvas.height - 5);
        });
    }