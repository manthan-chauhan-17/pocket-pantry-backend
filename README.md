# 🥫 Pocket Pantry: Backend API

**Pocket Pantry** is a Node.js-based backend API designed to manage personal kitchen inventory, track grocery items, suggest recipes, and reduce food waste. Built with Express.js and a modular structure, it offers an easy-to-extend foundation for personal or commercial food management applications.

---

## 🚀 Core Features

- **User Authentication**: Secure user registration and login using JWT.
- **Pantry Management**: Full CRUD (Create, Read, Update, Delete) functionality for pantry items.
- **Image Uploads**: Seamlessly upload and manage item images using Cloudinary with automatic cleanup.
- **Recipe Suggestions**: Get personalized recipe recommendations based on your pantry items using Spoonacular API.
- **Expiry Notifications**: Automated daily notifications for items nearing expiration via Firebase Cloud Messaging.
- **Automated Cleanup**: Smart cron jobs that automatically delete expired items and notify users.
- **Health Monitoring**: Comprehensive health check endpoints with auto-ping functionality to keep the server alive.
- **Advanced Date Management**: Sophisticated date utilities for precise expiry tracking and notifications.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Image Storage**: Cloudinary for cloud-based image management with automatic cleanup
- **Notifications**: Firebase Admin SDK for push notifications with smart token management
- **Recipe API**: Spoonacular API integration for recipe suggestions
- **Scheduled Jobs**: `node-cron` for automated tasks and cleanup
- **Date Management**: `dayjs` and `moment` for advanced date operations
- **HTTP Client**: `axios` for external API calls
- **Environment Management**: `dotenv`

---

## ⚙️ API Endpoints

### Authentication

| Method | Endpoint                | Description              | Auth Required |
| :----- | :---------------------- | :----------------------- | :-----------: |
| `POST` | `/api/v1/auth/register` | Register a new user.     |      No       |
| `POST` | `/api/v1/auth/login`    | Log in an existing user. |      No       |

### Pantry Management

| Method   | Endpoint                   | Description                             | Auth Required |
| :------- | :------------------------- | :-------------------------------------- | :-----------: |
| `GET`    | `/api/v1/item/get-items`   | Fetch all items for the logged-in user. |      Yes      |
| `POST`   | `/api/v1/item/add-item`    | Add a new item to the pantry.           |      Yes      |
| `PUT`    | `/api/v1/item/update-item` | Update an existing item.                |      Yes      |
| `DELETE` | `/api/v1/item/delete-item` | Delete an item from the pantry.         |      Yes      |

### Recipe Suggestions

| Method | Endpoint                        | Description                                   | Auth Required |
| :----- | :------------------------------ | :-------------------------------------------- | :-----------: |
| `POST` | `/api/v1/recipe/get-recipes`    | Get recipe suggestions based on pantry items. |      Yes      |
| `GET`  | `/api/v1/recipe/recipe-details` | Get detailed recipe information by ID.        |      No       |

### Notifications

| Method | Endpoint                              | Description                               | Auth Required |
| :----- | :------------------------------------ | :---------------------------------------- | :-----------: |
| `POST` | `/api/v1/notification/register-token` | Register a device for push notifications. |      Yes      |

### Health Monitoring

| Method | Endpoint              | Description                                 | Auth Required |
| :----- | :-------------------- | :------------------------------------------ | :-----------: |
| `GET`  | `/api/v1/healthcheck` | Check API health status.                    |      No       |
| `GET`  | `/api/v1/ping`        | Simple ping endpoint for uptime monitoring. |      No       |

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
# Server Configuration
PORT=3001
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

# Cloudinary Credentials (for image storage and management)
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

# Firebase Configuration (for push notifications)
FIREBASE_PROJECT_ID=<your_firebase_project_id>

# Spoonacular API (for recipe suggestions)
SPOONACULAR_API_KEY=<your_spoonacular_api_key>
```

### 4. Run the development server:

```bash
npm run dev
```

---

## 🔧 Advanced Features

### 🤖 Automated Cleanup System

The backend includes intelligent automated cleanup that:

- **Daily Expiry Notifications**: Sends push notifications for items expiring within 3 days
- **Automatic Deletion**: Removes expired items daily at midnight and notifies users
- **Smart Image Management**: Automatically deletes associated images from Cloudinary when items are removed
- **User Notifications**: Sends cleanup notifications to keep users informed

### 🍳 Recipe Suggestions

Powered by Spoonacular API integration:

- **Smart Recipe Matching**: Analyzes your pantry items to suggest relevant recipes
- **Detailed Recipe Information**: Get complete recipe details including ingredients and instructions
- **Optimized Suggestions**: Recipes are sorted by maximum ingredient usage from your pantry
- **Missing Ingredients**: Shows which ingredients you need to buy

### 📱 Enhanced Notification System

Advanced Firebase Cloud Messaging features:

- **Multi-Device Support**: Register multiple devices per user
- **Smart Token Management**: Automatically removes invalid tokens
- **Targeted Notifications**: Send specific notifications for expiry alerts and cleanup actions
- **Error Handling**: Robust error handling with automatic token cleanup

### 🏥 Health Monitoring

Comprehensive server monitoring:

- **Health Check Endpoints**: Monitor API status and uptime
- **Auto-Ping System**: Automatically pings the server every 14 minutes to prevent sleep
- **Status Monitoring**: Real-time health status reporting

### 📅 Advanced Date Management

Sophisticated date handling utilities:

- **Precise Timestamps**: UTC-based timestamp management
- **Date Arithmetic**: Add/subtract days with millisecond precision
- **Flexible Formatting**: Customizable date formatting for notifications
- **Timezone Support**: Proper timezone handling for global users

---

## 🚀 Getting Started with New Features

### Recipe Suggestions

1. Add items to your pantry using the item endpoints
2. Call `/api/v1/recipe/get-recipes` to get personalized recipe suggestions
3. Use the recipe ID to get detailed information via `/api/v1/recipe/recipe-details`

### Automated Notifications

1. Register your device token using `/api/v1/notification/register-token`
2. The system will automatically send notifications for expiring items
3. Receive cleanup notifications when expired items are automatically removed
