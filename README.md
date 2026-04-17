# Mini CRM — Client Lead Management System

A full-stack Mini CRM built to manage incoming client leads from website contact forms. Track lead status, add follow-up notes, filter/search leads, and view analytics — all from a secure admin dashboard.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![Express](https://img.shields.io/badge/Express-4.x-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-In--Memory-brightgreen) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🔐 **Secure Admin Login** — JWT-based authentication
- 📋 **Lead Management** — Full CRUD (Create, Read, Update, Delete)
- 🔄 **Status Tracking** — New → Contacted → Converted pipeline
- 📝 **Follow-up Notes** — Add timestamped notes to each lead
- 🔍 **Search & Filter** — Search by name/email, filter by status/source
- 📊 **Analytics Dashboard** — Visual charts for lead distribution
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 🎨 **Premium Dark UI** — Glassmorphism design with smooth animations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (in-memory via mongodb-memory-server) |
| **Auth** | JWT + bcrypt |

## 🚀 Deployment (Render)

This app is ready to be deployed to **Render** in 2 minutes:

1.  **Push to GitHub**: (Already done!)
2.  **Connect to Render**:
    -   Go to [Render.com](https://render.com) and sign in.
    -   Click **New +** > **Web Service**.
    -   Connect your GitHub repository (`FUTURE_FS_02`).
3.  **Configure**:
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
4.  **Click Deploy!**

*Note: Since this uses an in-memory database, your data will reset whenever the server restarts. For permanent storage, connect a real MongoDB Atlas URI.*

## 💻 Local Setup

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Create a `.env` file:
    ```env
    PORT=5000
    JWT_SECRET=your_secret_key
    ```
3.  **Run**:
    ```bash
    npm run dev
    ```
4.  **Login**:
    -   Email: `admin@minicrm.com`
    -   Password: `admin123`
