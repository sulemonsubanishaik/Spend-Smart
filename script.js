const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const statusMsg = document.getElementById('status-message');
const addBtn = document.querySelector('.btn-primary');

// ----------------- Utility -----------------
function getInitialTransactions() {
  const data = localStorage.getItem('transactions');
  if (data) return JSON.parse(data);
  return [{ id: 1, text: "Initial Income", amount: 1000, type: "income" }];
}

let transactions = getInitialTransactions();

// ----------------- Add Transaction -----------------
function addTransaction(e) {
  e.preventDefault();

  const desc = text.value.trim();
  const amt = parseFloat(amount.value);
  const ttype = type.value;

  if (!desc || isNaN(amt) || amt <= 0) return;

  // ✅ Check if expense is possible
  const currentBalance = getCurrentBalance();
  if (ttype === "expense" && amt > currentBalance) {
    statusMsg.textContent = "Insufficient balance! Cannot add this expense.";
    return; // block transaction
  }

  const transaction = {
    id: Date.now(),
    text: desc,
    amount: amt,
    type: ttype
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();
  form.reset();
}

// ----------------- DOM Rendering -----------------
function addTransactionDOM(transaction) {
  const sign = transaction.type === "expense" ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.type);

  item.innerHTML = `
    <span style="flex:1;text-align:left">${transaction.text}</span>
    <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button onclick="removeTransaction(${transaction.id})" title="Delete">&#10005;</button>
  `;

  list.appendChild(item);
}

// ----------------- Calculations -----------------
function getCurrentBalance() {
  let income = 0, expense = 0;
  transactions.forEach(tr => {
    if (tr.type === "income") income += tr.amount;
    else expense += tr.amount;
  });
  return income - expense;
}

function updateValues() {
  let income = 0, expense = 0;
  transactions.forEach(tr => {
    if (tr.type === "income") income += tr.amount;
    else expense += tr.amount;
  });

  const currentBalance = income - expense;

  balance.textContent = `₹${currentBalance.toFixed(2)}`;
  money_plus.textContent = `₹${income.toFixed(2)}`;
  money_minus.textContent = `₹${expense.toFixed(2)}`;

  // ✅ Live check for disabling button
  const amt = parseFloat(amount.value) || 0;
  const ttype = type.value;

  if (ttype === "expense" && amt > currentBalance) {
    statusMsg.textContent = "Insufficient balance";
    addBtn.disabled = true;
    addBtn.classList.add("disabled");
  } else {
    statusMsg.textContent = "";
    addBtn.disabled = false;
    addBtn.classList.remove("disabled");
  }
}

// ----------------- Remove Transaction -----------------
function removeTransaction(id) {
  transactions = transactions.filter(tr => tr.id !== id);
  updateLocalStorage();
  init();
}

// ----------------- Local Storage -----------------
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ----------------- Init -----------------
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// ----------------- Event Listeners -----------------
window.removeTransaction = removeTransaction;
form.addEventListener('submit', addTransaction);
type.addEventListener('change', updateValues);
amount.addEventListener('input', updateValues);

init();
