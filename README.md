# 🥫 Pocket Pantry

**Pocket Pantry** is a Node.js-based backend API designed to manage personal kitchen inventory, track grocery items, suggest recipes, and reduce food waste. Built with Express.js and a modular structure, it offers an easy-to-extend foundation for personal or commercial food management applications.

---

## 🚀 Features

- Add, update, and delete pantry items
- Track expiration dates
- Generate shopping lists
- Suggest recipes based on available ingredients
- RESTful API architecture
- Environment-based configuration

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose) 
- **Authentication:** JWT 
- **Others:** dotenv, nodemon, cors

---




---


## Installation

### 1. Clone the repository

```bash
git clone https://github.com/manthan-chauhan-17/poacket-pantry-backend.git
cd pocket-pantry-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
PORT=3000
DB_URL=<your_database_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRE_TIME =<your_jwt_expire_time>
```

### 4. Run the server

```bash
npm run dev
```
