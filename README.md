# ⚡ Mini CRM — Client Lead Management System

A full-stack Mini CRM built to manage incoming client leads from website contact forms. Track lead status, add follow-up notes, filter/search leads, and view analytics — all from a secure admin dashboard.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![Express](https://img.shields.io/badge/Express-4.x-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-In--Memory-brightgreen) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **🔐 Secure Admin Login** — JWT-based authentication
- **📋 Lead Management** — Full CRUD (Create, Read, Update, Delete)
- **🔄 Status Tracking** — New → Contacted → Converted pipeline
- **📝 Follow-up Notes** — Add timestamped notes to each lead
- **🔍 Search & Filter** — Search by name/email, filter by status/source
- **📊 Analytics Dashboard** — Visual charts for lead distribution
- **📱 Responsive Design** — Works on desktop, tablet, and mobile
- **🎨 Premium Dark UI** — Glassmorphism design with smooth animations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (in-memory via mongodb-memory-server) |
| Auth | JWT + bcrypt |

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/mini-crm.git
cd mini-crm
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the server
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5000
```

### 5. Login with demo credentials
```
Email: admin@minicrm.com
Password: admin123
```

> **Note:** No database setup required! The app uses an in-memory MongoDB instance that starts automatically. Sample data is seeded on every startup.

## 📁 Project Structure

```
├── server/
│   ├── config/db.js          # MongoDB in-memory connection
│   ├── middleware/auth.js     # JWT authentication
│   ├── models/Lead.js         # Lead data model
│   ├── models/User.js         # Admin user model
│   ├── routes/auth.js         # Login/register API
│   ├── routes/leads.js        # Leads CRUD API
│   ├── seeds/seed.js          # Sample data seeder
│   └── server.js              # Express entry point
├── client/
│   ├── css/styles.css         # Design system
│   ├── js/auth.js             # Auth logic
│   ├── js/dashboard.js        # Dashboard logic
│   ├── js/analytics.js        # Chart rendering
│   ├── index.html             # Login page
│   └── dashboard.html         # CRM dashboard
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create admin account |
| POST | `/api/auth/login` | Login (returns JWT) |

### Leads (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List leads (supports `?search`, `?status`, `?source`, `?sort`) |
| GET | `/api/leads/stats` | Get analytics data |
| POST | `/api/leads` | Create new lead |
| PUT | `/api/leads/:id` | Update lead |
| POST | `/api/leads/:id/notes` | Add follow-up note |
| DELETE | `/api/leads/:id` | Delete lead |

## 💡 Future Improvements

- [ ] Email notifications for new leads
- [ ] Export leads to CSV
- [ ] Role-based access (admin, sales rep, viewer)
- [ ] Lead scoring system
- [ ] Integration with external forms (Typeform, Google Forms)
- [ ] Persistent database (MongoDB Atlas)

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.
