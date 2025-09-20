# 🥫 Pocket Pantry: Backend API

**Pocket Pantry** is a Node.js-based backend API designed to manage personal kitchen inventory, track grocery items, suggest recipes, and reduce food waste. Built with Express.js and a modular structure, it offers an easy-to-extend foundation for personal or commercial food management applications.

---

## 🚀 Core Features

- **User Authentication**: Secure user registration and login using JWT.
- **Pantry Management**: Full CRUD (Create, Read, Update, Delete) functionality for pantry items.
- **Image Uploads**: Seamlessly upload and manage item images using Cloudinary.
- **Expiry Notifications**: A cron job runs daily to notify users about items nearing their expiration date via Firebase Cloud Messaging.
- **Health Checks**: Endpoints to monitor API status and uptime.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Image Storage**: Cloudinary for cloud-based image management.
- **Notifications**: Firebase Admin SDK for push notifications.
- **Scheduled Jobs**: `node-cron` for automated tasks.
- **Environment Management**: `dotenv`

---

## ⚙️ API Endpoints

| Method   | Endpoint                              | Description                               | Auth Required |
| :------- | :------------------------------------ | :---------------------------------------- | :-----------: |
| `POST`   | `/api/v1/auth/register`               | Register a new user.                      |      No       |
| `POST`   | `/api/v1/auth/login`                  | Log in an existing user.                  |      No       |
| `GET`    | `/api/v1/item/get-items`              | Fetch all items for the logged-in user.   |      Yes      |
| `POST`   | `/api/v1/item/add-item`               | Add a new item to the pantry.             |      Yes      |
| `PUT`    | `/api/v1/item/update-item`            | Update an existing item.                  |      Yes      |
| `DELETE` | `/api/v1/item/delete-item`            | Delete an item from the pantry.           |      Yes      |
| `POST`   | `/api/v1/notification/register-token` | Register a device for push notifications. |      Yes      |

---

## 📦 Installation & Setup

### 1. Clone the repository:

```bash
git clone (https://github.com/manthan-chauhan-17/pocket-pantry-backend.git)
cd pocket-pantry-backend
```

### 2. Install Dependencies:

```bash
npm install
```

### 3. Setup Environment Variables:

```bash
PORT=3001
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

# Firebase Project ID
FIREBASE_PROJECT_ID=<your_firebase_project_id>
```

### 4. Run the development server:

```bash
npm run dev
```
