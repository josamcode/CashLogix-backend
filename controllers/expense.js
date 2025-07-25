const mongoose = require("mongoose");
const userModel = require("../models/user");

exports.createExpense = async (req, res) => {
  try {
    const { amount, category, description, project, date } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let formattedDate;
    let warningMessage = null;

    if (date) {
      formattedDate = new Date(date);
      formattedDate.setHours(0, 0, 0, 0);

      if (formattedDate > today) {
        // Future date – override and warn
        formattedDate = new Date();
        formattedDate.setHours(0, 0, 0, 0);
        warningMessage = "Future date detected. Date has been set to today instead.";
      }
    } else {
      // No date provided – use today
      formattedDate = new Date();
      formattedDate.setHours(0, 0, 0, 0);
    }

    const expense = {
      amount,
      category,
      description,
      project,
      date: formattedDate,
    };

    user.expenses.push(expense);
    await user.save();

    res.status(201).json({
      message: "Expense created successfully",
      result: user.expenses[user.expenses.length - 1],
      ...(warningMessage && { warning: warningMessage }),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { from, to, category } = req.query;

    let filteredExpenses = user.expenses;

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      filteredExpenses = filteredExpenses.filter(
        (exp) => new Date(exp.date) >= fromDate && new Date(exp.date) <= toDate
      );
    }

    if (category) {
      filteredExpenses = filteredExpenses.filter(
        (exp) =>
          exp.category?.toString().trim().toLowerCase() ===
          category.toString().trim().toLowerCase()
      );
    }

    const totalAmount = filteredExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    const categoryCountMap = {};
    filteredExpenses.forEach((exp) => {
      const cat = exp.category?.toString().trim();
      categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
    });

    const mostUsedCategory = Object.entries(categoryCountMap).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      ["", 0]
    )[0];

    res.status(200).json({
      length: filteredExpenses.length,
      totalAmount,
      mostUsedCategory,
      categoryCounts: categoryCountMap,
      expenses: filteredExpenses,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while getting expenses", error: err.message });
  }
};

// http://localhost:5000/api/expenses?from=2025-06-25&to=2025-06-26&category=food

exports.getExpense = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const expense = user.expenses.id(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching expense",
      error: err.message,
    });
  }
};

exports.editExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const expense = user.expenses.id(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (date !== undefined) {
      expense.date = new Date(date);
    }

    await user.save();

    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating expense",
      error: err.message,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const expense = user.expenses.id(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    user.expenses.pull(expense._id);

    await user.save();

    res.status(200).json({ message: "Expense deleted successfully", expense });
  } catch (err) {
    res.status(500).json({
      message: "Error while deleting expense",
      error: err.message,
    });
  }
};
