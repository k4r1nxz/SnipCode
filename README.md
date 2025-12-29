
# 💻 SnipCode

**SnipCode** is a high-performance code repository platform. It features a **Go** backend and a **React TypeScript** frontend, designed with a decoupled architecture for security and scalability.

---

## 🛠️ Environment Configuration

### **Frontend API Setup**

You must define your backend URL in the frontend directory.

1. Go to `/frontend`.
2. Create a `.env` file.
3. Add: `VITE_API_URL=http://localhost:8080`.

---

## 👑 Admin Configuration (Important)

The backend includes a built-in seeding mechanism to create initial administrator accounts. You can customize these credentials directly in the source code before running the server.

### **How to Customize Admin Credentials**

1. Open `main.go`.
2. Locate the `seedAdminUsers()` function.
3. **Change Usernames**: Modify the `admins := []string{"admin", "admin2"}` slice to your preferred usernames.
4. **Change Password**: Modify the `fixedPassword := "admin123"` variable.
5. **Set Roles**: The system automatically assigns the `"admin"` role to these users, granting them full access to the dashboard.

The system uses **Bcrypt** to hash these passwords securely before saving them to the database.

---

## 🚀 Key Features

* **Type-Safe UI**: Built with **React** and **TypeScript** for reliable data handling.
* **Fast API**: Powered by **Go (Gin Gonic)** for low-latency responses.
* **Auto-Seeding**: Automatic creation of admin accounts upon first run via `seedAdminUsers()`.
* **Security**: Centralized JWT authentication handled in `storageService.ts`.

---

## 📦 Installation

### **1. Backend (Go 1.23)**

```bash
go mod tidy
go run main.go

```

The server will initialize the SQLite database (`app.db`) and seed the admins.

### **2. Frontend (React TS)**

```bash
cd frontend
npm install
npm run dev

```

---

## 📂 Structure

* **backend/**: Handlers, Models, and Admin Seeding logic.
* **frontend/**: React Components (`.tsx`) and Storage Services (`.ts`).

---

## ⚠️ Support

If you encounter errors, please [open a GitHub issue](https://github.com/k4r1nxz/SnipCode/issues) or contact the developer directly for critical bug reports.

**Developed by Karin**
