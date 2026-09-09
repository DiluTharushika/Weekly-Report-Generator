# 📊 Team Weekly Reports

### MERN-Based Team Reporting, Review & Analytics Platform

A full-stack reporting platform that enables team members to submit structured weekly reports while managers and administrators can review, approve, request corrections, and analyze team performance from a centralized dashboard.

---

## ✨ Features

* 🔐 Authentication & Role-Based Access Control
* 📝 Structured weekly report creation and submission
* 🔄 Report review, correction, and approval workflow
* 📚 Report version history
* 📊 Manager dashboard with analytics
* 🔎 Filtering by member, project, date, and status
* 🗂️ Project and category management
* 👥 User and role management
* 📈 Task, workload, and time analytics
* 🚧 Blocker and achievement tracking
* 📱 Responsive design
* 🧪 Automated testing
* 🤖 AI Chat Assistant

### User Roles

| Role            | Access                                                                |
| --------------- | --------------------------------------------------------------------- |
| **Team Member** | Create, edit, submit, and view own reports                            |
| **Manager**     | Review team reports, approve, request corrections, and view analytics |
| **Admin**       | Manage users, roles, projects, and reports                            |

---

## 🔄 Report Workflow

```text
Draft
  ↓
Submitted
  ↓
Manager Review
  ├── Approve → Approved
  │
  └── Request Changes
          ↓
   Team Member Correction
          ↓
       Resubmit
          ↓
    Manager Review
          ↓
       Approved
```

Previous versions are preserved when a report is corrected and resubmitted.

---

## 🏗️ System Architecture

```text
React
  │
  │ REST API
  ▼
Node.js + Express
  │
  ▼
MongoDB
```

---

## 🛠️ Technology Stack

**Frontend:** React, React Router, Axios/Fetch, Charting Library

**Backend:** Node.js, Express.js, REST API, Authentication & Authorization

**Database:** MongoDB, Mongoose

**Tools:** Git, GitHub, npm, Postman, ESLint

---

## 📁 Project Structure

```text
team-weekly-reports/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   └── utils/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── validators/
├── seed/
├── tests/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🗄️ Database

The application uses MongoDB with Mongoose.

Main collections include:

* **Users**
* **Projects**
* **Weekly Reports**
* **Report Versions**
* **Review History**

---

## 🔌 REST API

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Reports

```http
GET  /api/reports
POST /api/reports
GET  /api/reports/:id
PUT  /api/reports/:id
POST /api/reports/:id/submit
GET  /api/reports/:id/versions
```

### Manager Review

```http
GET  /api/reports/review/pending
POST /api/reports/:id/approve
POST /api/reports/:id/request-correction
```

### Dashboard

```http
GET /api/dashboard/summary
GET /api/dashboard/task-trends
GET /api/dashboard/report-status
GET /api/dashboard/project-workload
GET /api/dashboard/time-distribution
GET /api/dashboard/activity
```

---

## 🔒 Security

* Secure password hashing
* Authentication-protected APIs
* Backend role-based authorization
* Report ownership validation
* Input validation
* CORS configuration
* Environment variables for secrets
* Centralized error handling

---

## ⚙️ Setup

### Requirements

* Node.js 18+
* npm
* MongoDB / MongoDB Atlas
* Git

### Installation

```bash
git clone https://github.com/DiluTharushika/YOUR-REPOSITORY-NAME.git
cd YOUR-REPOSITORY-NAME
npm install
```

Create the required `.env` file using `.env.example`.

Start the application:

```bash
npm run dev
```

For demo data:

```bash
npm run seed
```

---

## 📸 Screenshots

Add screenshots of the main application pages:

```md
![Login](./docs/screenshots/login.png)
![Dashboard](./docs/screenshots/dashboard.png)
![Weekly Report](./docs/screenshots/weekly-report.png)
![Manager Review](./docs/screenshots/review.png)
![Report History](./docs/screenshots/report-history.png)
```

---

## 🌐 Demo

**GitHub Repository:** `https://github.com/DiluTharushika/YOUR-REPOSITORY-NAME`

---

## 🤖 AI Chat Assistant

The AI assistant helps managers analyze team reports and provides insights about:

* Completed work
* Team blockers
* Project workload
* Weekly achievements
* Workload distribution

---

## 🚀 Future Improvements

* Email notifications and reminders
* Slack / Microsoft Teams integration
* Calendar integration
* PDF / CSV exports
* Two-factor authentication
* SSO integration
* Advanced analytics
* Report comparison
* Advanced AI-generated summaries
* Progressive Web App support

---

## 🏆 Project Highlights

This project demonstrates practical experience in:

* MERN stack development
* React application architecture
* Node.js & Express API development
* MongoDB data modeling
* Authentication & authorization
* Role-based access control
* REST API design
* CRUD operations
* Business workflow implementation
* Report versioning
* Dashboard & data visualization
* Responsive UI
* API security
* Automated testing

---

## 👩‍💻 Author

### Dilu Tharushika

**Full-Stack Developer**

[GitHub](https://github.com/DiluTharushika) · [LinkedIn](YOUR_LINKEDIN_URL)

---

## 📄 License

This project is licensed under the **MIT License**.

<p align="center">
Built with ❤️ using the MERN Stack
</p>
