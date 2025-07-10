const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");
const { verifyToken, allowUserOnly } = require("../middlewares/auth");

router.post(
  "/expenses",
  verifyToken,
  allowUserOnly,
  expenseController.createExpense
);
router.get("/expenses", verifyToken, expenseController.getExpenses);
router.get("/expenses/:id", verifyToken, expenseController.getExpense);
router.put(
  "/expenses/:id",
  verifyToken,
  allowUserOnly,
  expenseController.editExpense
);
router.delete(
  "/expenses/:id",
  verifyToken,
  allowUserOnly,
  expenseController.deleteExpense
);

module.exports = router;
