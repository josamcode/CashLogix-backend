# Expenses Management App - Backend

A simple backend for a to-do list and expense tracking app built with Node.js, Express, and MongoDB.

---

## 📌 Overview

This is the backend part of a full-stack application that allows users to:

- Register and login using JWT authentication.
- Create, read, update, and delete expenses.
- Filter and analyze expenses by date and category.
- Supervisor login with a separate password.

---

## 🔧 Technologies Used

| Technology | Description                   |
| ---------- | ----------------------------- |
| Node.js    | Runtime environment           |
| Express.js | Web framework                 |
| MongoDB    | NoSQL database                |
| Mongoose   | ODM for MongoDB               |
| JWT        | Authentication tokens         |
| Bcryptjs   | Password hashing              |
| Cors       | Cross-Origin Resource Sharing |
| Dotenv     | Environment variables         |

---

## 🗂️ Folder Structure

```
/backend
├── controllers/
│   ├── expense.js    --> Expense-related logic
│   └── user.js       --> User-related logic
├── models/
│   ├── expense.js    --> Expense model
│   └── user.js       --> User model with embedded expenses
├── routes/
│   ├── expense.js    --> Expense API routes
│   └── user.js       --> User API routes
├── middlewares/
│   └── auth.js       --> Token verification middleware
├── .env              --> Environment variables
├── index.js          --> Entry point
└── package.json      --> Project dependencies and scripts
```

---

## 🛠️ Environment Variables

Create a `.env` file in the root directory with the following:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expensesDB
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## 🚀 How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   node index.js
   ```

3. The server will be available at:
   ```
   http://localhost:5000
   ```

---

## 🧪 Available APIs

### 🔐 Authentication (User)

| Method | Route                | Description              | Requires Auth |
| ------ | -------------------- | ------------------------ | ------------- |
| POST   | `/api/auth/register` | Register new user        | ❌            |
| POST   | `/api/auth/login`    | Login as user/supervisor | ❌            |

### 👤 User Management

| Method | Route                 | Description           | Requires Auth |
| ------ | --------------------- | --------------------- | ------------- |
| GET    | `/api/getUser`        | Get current user info | ✅            |
| PUT    | `/api/updateUser/:id` | Update user info      | ❌            |
| DELETE | `/api/deleteUser/:id` | Delete a user         | ❌            |

### 💰 Expense Management

| Method | Route               | Description                     | Requires Auth |
| ------ | ------------------- | ------------------------------- | ------------- |
| POST   | `/api/expenses`     | Create new expense              | ✅ (user)     |
| GET    | `/api/expenses`     | Get all expenses (with filters) | ✅            |
| GET    | `/api/expenses/:id` | Get single expense              | ✅            |
| PUT    | `/api/expenses/:id` | Update an expense               | ✅ (user)     |
| DELETE | `/api/expenses/:id` | Delete an expense               | ✅ (user)     |

#### Example Filtering:

```
GET /api/expenses?from=2025-06-25&to=2025-06-26&category=food
```

---

## 🔐 Authentication & Roles

- **User**: Can create, edit, and delete their own expenses.
- **Supervisor**: Has a separate password (`password2`) and can only log in using it.

Middleware used:

- `verifyToken`: Ensures valid JWT token.
- `allowUserOnly`: Restricts certain operations to regular users only.

---

## 📊 Sample Response from `/api/expenses`

```json
{
  "length": 5,
  "totalAmount": 250,
  "mostUsedCategory": "food",
  "categoryCounts": {
    "food": 3,
    "transport": 2
  },
  "expenses": [
    { "amount": 50, "category": "food", "description": "Lunch", "date": "2025-06-25T14:30:00.000Z" },
    ...
  ]
}
```

---

## 📝 Notes

- Passwords are hashed using bcrypt.
- Supervisor password (`password2`) is auto-generated if not provided.
- Date must not be in the future.
- JWT token expires after 365 days.

---

## 🧩 Future Improvements (Optional)

- Add Swagger documentation.
- Add tests using Jest or Mocha.
- Implement role-based access more strictly.
- Use pagination for large expense lists.

---
