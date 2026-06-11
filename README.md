# 🏆 TourneyHub — MERN Stack Sports Tournament Management Platform

## Project Overview
TourneyHub is a complete MERN stack web application for managing local sports tournaments. It supports organizers, team captains, and public viewers.

---

## 📁 Project Structure
```
TourneyHub/
├── backend/         ← Node.js + Express + MongoDB API
└── frontend/        ← React.js + Vite + Bootstrap UI
```

---

## ⚙️ Prerequisites
Make sure you have these installed:
- **Node.js** v18+ — https://nodejs.org
- **MongoDB** (local) or a **MongoDB Atlas** account
- **VS Code** (recommended editor)
- **Postman** (optional, for API testing)

---

## 🚀 Setup & Run Instructions

### Step 1: Clone / Download the Project
Place the `TourneyHub` folder anywhere on your computer.

---

### Step 2: Setup the Backend

Open a terminal and run:
```bash
cd TourneyHub/backend
npm install
```

**Configure the .env file** (already created for you):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tourneyhub
JWT_SECRET=tourneyhub_super_secret_jwt_key_2024
NODE_ENV=development
```

> If using **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string:
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tourneyhub`

**Start the backend:**
```bash
npm run dev
```
You should see:
```
✅ TourneyHub server running on port 5000
✅ MongoDB Connected: localhost
```

---

### Step 3: Setup the Frontend

Open a **new terminal** and run:
```bash
cd TourneyHub/frontend
npm install
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:3000/
```

Open **http://localhost:3000** in your browser.

---

## 👥 User Roles & Test Accounts

Register accounts using the Register page with these roles:

| Role | What they can do |
|------|-----------------|
| **admin** | Create tournaments, approve teams, generate fixtures, update scores, verify payments, reply to complaints |
| **captain** | Register teams, add players, upload payment screenshots, view fixtures |
| **player** | View tournaments, fixtures, results, points table (public viewer) |

> **Tip:** Register your first account as `admin` to access the full dashboard.

---

## 📋 How to Use (Step-by-Step Flow)

### As Admin:
1. Register → Select role: **Organizer / Admin**
2. Go to **Admin Dashboard** → Click **Create Tournament**
3. Fill in tournament details, set status to `registration_open`
4. Share the tournament link with team captains

### As Captain:
1. Register → Select role: **Team Captain**
2. Go to **Home** → Find the tournament → Click **Register Your Team**
3. Add all player details (name, age, role, jersey number)
4. Upload payment screenshot (UPI/bank transfer)

### As Admin (continued):
5. Go to **Admin Dashboard** → Select the tournament
6. **Teams tab** → Approve team registrations
7. **Payments tab** → Verify payment screenshots
8. **Fixtures tab** → Click **Generate Fixtures** (needs ≥2 approved teams)
9. After matches are played → Update match results

### Public Viewers:
- Anyone can visit the site without login
- View fixtures, points table, live scores without an account

---

## 🗂️ API Endpoints Reference

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | Private |

### Tournaments
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/tournaments | Public |
| GET | /api/tournaments/:id | Public |
| POST | /api/tournaments | Admin |
| PUT | /api/tournaments/:id | Admin |
| DELETE | /api/tournaments/:id | Admin |

### Teams
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/teams/register | Captain |
| GET | /api/teams/my-teams | Captain |
| GET | /api/teams/tournament/:id | Public |
| PUT | /api/teams/:id/approve | Admin |
| PUT | /api/teams/:id/reject | Admin |

### Matches
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/matches/generate-fixtures/:id | Admin |
| GET | /api/matches/tournament/:id | Public |
| GET | /api/matches/points-table/:id | Public |
| PUT | /api/matches/:id/result | Admin |

### Scores
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/scores/:matchId | Admin |
| GET | /api/scores/:matchId | Public |
| PUT | /api/scores/:matchId | Admin |

### Payments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/payments/upload | Captain |
| GET | /api/payments/tournament/:id | Admin |
| PUT | /api/payments/:id/verify | Admin |
| PUT | /api/payments/:id/reject | Admin |

### Complaints
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/complaints | Private |
| GET | /api/complaints/all | Admin |
| GET | /api/complaints/tournament/:id | Private |
| PUT | /api/complaints/:id/reply | Admin |

---

## 🔧 Common Issues & Fixes

**MongoDB not connecting?**
- Make sure MongoDB service is running: `mongod` in terminal
- Or use MongoDB Atlas with correct connection string in `.env`

**Port already in use?**
- Backend: Change `PORT=5001` in `.env`
- Frontend: Change port in `vite.config.js` and update proxy target

**"Not authorized" errors?**
- Make sure you're logged in and the JWT token is valid
- Try logging out and logging back in

**Payment screenshot not uploading?**
- The `backend/uploads/` folder is created automatically
- Make sure the file is an image (jpg, png, gif, webp) and under 5MB

---

## 🏗️ Technology Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- Multer (file uploads)
- dotenv, cors

### Frontend
- React.js 18 + Vite
- React Router DOM v6
- Axios (API calls)
- Bootstrap 5 (UI styling)
- Bootstrap Icons
- React Toastify (notifications)

---

## 📦 Package Commands

```bash
# Backend
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production

# Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🎓 Final Year Project Notes

This project demonstrates:
- ✅ MERN Stack (MongoDB, Express, React, Node.js)
- ✅ JWT Authentication & Role-Based Access Control
- ✅ RESTful API Design
- ✅ File Upload with Multer
- ✅ Protected Routes (Frontend & Backend)
- ✅ CRUD Operations
- ✅ Database Relationships (References between models)
- ✅ Business Logic (Points table calculation, fixture generation)
- ✅ Admin Dashboard
- ✅ Public Pages (no login required)
- ✅ Responsive UI with Bootstrap 5

---

*TourneyHub — Making local sports tournaments transparent and digital* 🏆
