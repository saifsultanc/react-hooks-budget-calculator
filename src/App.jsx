import React, { useState, useEffect } from "react";
import "./App.css";
import { ExpenseList } from "./components/ExpenseList";
import { ExpenseForm } from "./components/ExpenseForm";
import { Alert } from "./components/Alert";
import uuid from "uuid/v4";

// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1600 },
//   { id: uuid(), charge: "car payment", amount: 400 },
//   { id: uuid(), charge: "debit card", amount: 1200 }
// ];

const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

export const App = () => {
  // ---- state values ----
  // all expenses, add expenses
  const [expenses, setExpenses] = useState(initialExpenses);
  // single expense
  const [charge, setCharge] = useState("");
  // single amount
  const [amount, setAmount] = useState("");
  // alert
  const [alert, setAlert] = useState({ show: false });
  // edit
  const [edit, setEdit] = useState(false);
  //edit item
  const [id, setId] = useState(0);

  // use effect
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleCharge = e => {
    setCharge(e.target.value);
  };

  const handleAmount = e => {
    setAmount(e.target.value);
  };

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 2000);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let editedExpenses = expenses.map(expense => {
          return expense.id === id ? { ...expense, charge, amount } : expense;
        });
        setExpenses(editedExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "item edited" });
      } else {
        const singleExpense = { id: uuid(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: "success", text: "item added" });
      }
      setCharge("");
      setAmount("");
    } else {
      handleAlert({
        type: "danger",
        text: `charge can't be empty value and amount value has to be bigger than zero.`
      });
    }
  };

  // clear all items
  const clearItems = () => {
    //console.log("cleared all items");
    setExpenses([]);
    handleAlert({ type: "danger", text: "all items deleted" });
  };

  const handleDelete = id => {
    //console.log(`item deleted : ${id}`);
    let updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    handleAlert({ type: "danger", text: "item deleted" });
  };

  const handleEdit = id => {
    //console.log(`item edited : ${id}`);
    let { charge, amount } = expenses.find(item => item.id === id);
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
    // let updatedExpenses = expenses.filter(expense => expense.id !== id);
    // setExpenses(updatedExpenses);
  };

  // ---- functionalities ----
  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>budget calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        total spending:
        <span className="total">
          ${" "}
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
};

export default App;
