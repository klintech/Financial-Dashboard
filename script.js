document.addEventListener('DOMContentLoaded', () => {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let budget = parseFloat(localStorage.getItem('budget')) || 1000;
    let savingsGoal = parseFloat(localStorage.getItem('savingsGoal')) || 5000;

    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const budgetForm = document.getElementById('budget-form');
    const budgetInfo = document.getElementById('budget-info');
    const budgetProgress = document.getElementById('budget-progress');
    const transactionsList = document.getElementById('transactions-list');
    const savingsForm = document.getElementById('savings-form');
    const savingsInfo = document.getElementById('savings-info');
    const savingsProgress = document.getElementById('savings-progress');

    const pieChart = new Chart(document.getElementById('pie-chart'), {
        type: 'pie',
        data: {
            labels: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        }
    });

    function updateExpenseList() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.textContent = `${expense.description}: $${expense.amount.toFixed(2)} (${expense.category})`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteExpense(index);
            li.appendChild(deleteBtn);
            expenseList.appendChild(li);
        });
    }

    function updateChart() {
        const categoryTotals = [0, 0, 0, 0, 0];
        expenses.forEach(expense => {
            const categoryIndex = ['food', 'transportation', 'entertainment', 'utilities', 'other'].indexOf(expense.category);
            if (categoryIndex !== -1) {
                categoryTotals[categoryIndex] += expense.amount;
            }
        });
        pieChart.data.datasets[0].data = categoryTotals;
        pieChart.update();
    }

    function updateBudgetInfo() {
        const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);
        const remainingBudget = budget - totalSpent;
        budgetInfo.textContent = `Budget: $${budget.toFixed(2)} | Spent: $${totalSpent.toFixed(2)} | Remaining: $${remainingBudget.toFixed(2)}`;
        const progressPercentage = (totalSpent / budget) * 100;
        budgetProgress.innerHTML = `<div style="width: ${progressPercentage}%"></div>`;
    }

    function updateTransactions() {
        transactionsList.innerHTML = '';
        expenses.slice(-5).reverse().forEach(expense => {
            const li = document.createElement('li');
            li.textContent = `${expense.description}: $${expense.amount.toFixed(2)} (${expense.category})`;
            transactionsList.appendChild(li);
        });
    }

    function updateSavingsInfo() {
        const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);
        const savedAmount = Math.max(savingsGoal - totalSpent, 0);
        savingsInfo.textContent = `Goal: $${savingsGoal.toFixed(2)} | Saved: $${savedAmount.toFixed(2)}`;
        const progressPercentage = (savedAmount / savingsGoal) * 100;
        savingsProgress.innerHTML = `<div style="width: ${progressPercentage}%"></div>`;
    }

    function addExpense(expense) {
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateExpenseList();
        updateChart();
        updateBudgetInfo();
        updateTransactions();
        updateSavingsInfo();
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateExpenseList();
        updateChart();
        updateBudgetInfo();
        updateTransactions();
        updateSavingsInfo();
    }

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('expense-description').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        if (description && amount && category) {
            addExpense({ description, amount, category });
            expenseForm.reset();
        }
    });

    budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newBudget = parseFloat(document.getElementById('budget-amount').value);
        if (newBudget) {
            budget = newBudget;
            localStorage.setItem('budget', budget);
            updateBudgetInfo();
        }
    });

    savingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newGoal = parseFloat(document.getElementById('savings-amount').value);
        if (newGoal) {
            savingsGoal = newGoal;
            localStorage.setItem('savingsGoal', savingsGoal);
            updateSavingsInfo();
        }
    });

    updateExpenseList();
    updateChart();
    updateBudgetInfo();
    updateTransactions();
    updateSavingsInfo();
});