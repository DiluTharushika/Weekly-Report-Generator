<div align="center">

# 📊 Team Weekly Reports

### 🚀 MERN-Based Team Reporting, Review & Analytics Platform

A professional internal reporting system that helps **team members submit standardized weekly reports** and enables **managers/admins to review, approve, track, and analyze team performance** from one centralized dashboard.

<br />

[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-REST%20API-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge)](https://mongoosejs.com/)

<br />

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DiluTharushika)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

</div>

---

## 📖 Overview

**Team Weekly Reports** is a full-stack **MERN application** designed to replace inconsistent spreadsheet, document, and email-based weekly reporting with a centralized, structured, and secure reporting platform.

The system allows team members to create standardized weekly reports while managers can review, approve, request corrections, and analyze reports across the entire team.

Every team member follows the **same fixed report structure**, ensuring that reports remain consistent, comparable, and easy to analyze.

---

## 🎯 Project Goals

The main goals of this project are to:

- Standardize weekly team reporting
- Provide secure role-based access
- Make team progress visible to managers
- Simplify the report approval process
- Track blockers and achievements
- Preserve report history and correction versions
- Analyze workload and project distribution
- Provide meaningful team-level analytics

---

# ✨ Key Features

## 🔐 Authentication & Role-Based Access

The application provides secure authentication and authorization.

### Features

- User registration
- Secure login
- Logout
- Password protection
- Authentication-protected routes
- Role-based access control
- Secure session/token handling
- User ownership validation
- Protected backend APIs

### Supported Roles

| Role | Description |
|---|---|
| 👤 Team Member | Creates, edits, and submits personal weekly reports |
| 👨‍💼 Manager | Reviews and analyzes reports across the team |
| 🛡️ Admin | Full management access including users and roles |

### Permission Matrix

| Feature | Team Member | Manager | Admin |
|---|:---:|:---:|:---:|
| Register | ✅ | ✅ | ✅ |
| Login / Logout | ✅ | ✅ | ✅ |
| Create own report | ✅ | — | — |
| Edit own draft | ✅ | — | — |
| Edit correction report | ✅ | — | — |
| Submit report | ✅ | — | — |
| View own history | ✅ | — | — |
| View team reports | — | ✅ | ✅ |
| Review reports | — | ✅ | ✅ |
| Approve reports | — | ✅ | ✅ |
| Request changes | — | ✅ | ✅ |
| Dashboard analytics | — | ✅ | ✅ |
| Manage projects | — | ✅ | ✅ |
| Manage users | — | — | ✅ |
| Assign roles | — | — | ✅ |

> **Security:** Authorization is enforced on the backend. Frontend route protection is not used as the only security mechanism.

---

# 📝 Weekly Report Management

Every team member uses the same fixed report structure.

Reports contain:

### 📅 Week / Date Range

Defines the reporting period.

### 🏷️ Project / Category

Each report can be associated with a project or work category.

Examples:

- Client A
- Internal Tooling
- R&D
- Marketing
- Maintenance

### ✅ Tasks Completed

Each task includes:

| Field | Description |
|---|---|
| Task Name | Name of the completed task |
| Priority | Task priority |
| Planned % | Planned completion |
| Actual % | Actual completion |
| Status | Current task status |
| Planned Time | Expected effort |
| Time Spent | Actual effort |
| Deliverable | Output/deliverable produced |

### 📌 Tasks Planned for Next Week

Team members can document upcoming work.

### 🚧 Blockers / Challenges

Team members can document problems affecting their work.

One blocker can be marked as:

> **Key Issue of the Week**

### ⭐ Achievements / Highlights

Important accomplishments can be recorded.

One achievement can be marked as:

> **Key Achievement of the Week**

### ⏱️ Hours Worked

Optional time tracking by task type:

- Development
- Testing
- Meetings
- Documentation
- Research
- Other

### 🔗 Notes & Links

Optional notes, references, URLs, and supporting information.

---

# 🔄 Report Review Workflow

The application implements a complete report review cycle.

```text
┌─────────────┐
│    Draft    │
└──────┬──────┘
       │ Submit
       ▼
┌─────────────┐
│  Submitted  │
└──────┬──────┘
       │
       ├─────────────── Approve ──────────────► ┌──────────┐
       │                                        │ Approved │
       │                                        └──────────┘
       │
       └──────── Request Changes ─────────────► ┌──────────────────┐
                                                │ Needs Correction │
                                                └────────┬─────────┘
                                                         │
                                                        Edit
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │  Submitted  │
                                                  └─────────────┘
```

## Statuses

| Status | Description |
|---|---|
| 📝 Draft | Report is being prepared |
| 📤 Submitted | Report is waiting for manager review |
| 🔁 Needs Correction | Manager requested changes |
| ✅ Approved | Manager approved the report |
| ⏳ Not Started | No report has been created |

---

# 🔁 Correction Workflow

When a manager requests changes:

1. Manager opens the submitted report
2. Manager selects **Request Changes**
3. Manager enters a general correction comment
4. Report status changes to `Needs Correction`
5. Team member sees the feedback
6. Team member edits the report
7. Team member resubmits the report
8. A new version is preserved
9. Report returns to `Submitted`
10. Manager reviews the corrected version
11. Manager approves the report

This creates a complete end-to-end workflow:

```text
Submit
   ↓
Manager Review
   ↓
Request Changes
   ↓
Team Member Correction
   ↓
Resubmit
   ↓
Manager Review
   ↓
Approve
```

---

# 📚 Report Version History

The application preserves previous versions when a report goes through a correction cycle.

Previous report content is **not simply overwritten**.

Example:

```text
Week 35

├── Version 1
│   ├── Submitted: Aug 28
│   ├── Status: Needs Correction
│   └── Manager Comment
│
└── Version 2
    ├── Submitted: Sep 01
    └── Status: Approved
```

Each version can contain:

- Version number
- Complete report snapshot
- Submission timestamp
- Submitter
- Review information

Managers can inspect previous versions to understand how the report changed.

---

# 📊 Manager Dashboard

Managers have access to a centralized team dashboard.

## Summary Metrics

The dashboard displays:

- 📤 Total reports submitted this week
- 📈 Submission compliance rate
- ⏳ Pending reports
- 🚨 Late/missing reports
- 🔁 Reports needing correction
- 🚧 Open blockers
- ✅ Approved reports

---

## 🔎 Dashboard Filters

Managers can filter reports by:

- Week
- Date range
- Team member
- Project/category
- Report status

---

# 📈 Data Visualization

The dashboard provides several visual insights.

## Task Completion Trend

Track completed tasks over time.

```text
Completed Tasks
     │
  20 │              ╭──╮
  15 │       ╭──╮   │  │
  10 │  ╭──╮ │  │╭──╯  │
   5 │  │  │ │  ││     │
   0 └──┴──┴─┴──┴┴─────┴──► Week
```

## Report Status by Team Member

Compare:

- Draft
- Submitted
- Needs Correction
- Approved
- Not Started

## Workload by Project

Analyze how team effort is distributed across different projects.

## Time by Task Type

Compare time spent on:

```text
Development
Testing
Meetings
Documentation
Research
Other
```

## Recent Activity

The dashboard tracks recent actions such as:

- Report submitted
- Report resubmitted
- Report approved
- Report returned for correction

---

# 🗂️ Project & Category Management

Projects/categories are managed independently.

### Supported Operations

- ➕ Add project/category
- ✏️ Edit project/category
- 🗑️ Delete project/category
- 👥 Assign team members

### Example Categories

```text
Client A
Internal Tooling
R&D
Marketing
Maintenance
```

---

# 📄 Application Pages

The application contains multiple dedicated pages/views.

| # | Page | Purpose |
|---|---|---|
| 01 | 🔐 Login | User authentication |
| 02 | 📝 Register | New account creation |
| 03 | 📋 Weekly Report | Create and edit personal reports |
| 04 | 📚 Report History | View previous reports and statuses |
| 05 | 👁️ Report Detail | Read-only report view |
| 06 | 📊 Team Dashboard | Team analytics |
| 07 | 🔎 Manager Review | Approve/request corrections |
| 08 | 👤 Team Member Profile | Member history and statistics |
| 09 | 🗂️ Project Management | Project/category CRUD |
| 10 | 👥 User Management | Admin user and role management |

---

# 🏗️ System Architecture

```text
                     ┌─────────────────────┐
                     │     React Client    │
                     │                     │
                     │ Pages               │
                     │ Components          │
                     │ Forms               │
                     │ Charts              │
                     └──────────┬──────────┘
                                │
                           REST / HTTP
                                │
                                ▼
                     ┌─────────────────────┐
                     │    Express API      │
                     │                     │
                     │ Routes              │
                     │ Controllers         │
                     │ Services            │
                     │ Validation          │
                     │ Authentication      │
                     │ Authorization       │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │      MongoDB        │
                     │                     │
                     │ Users               │
                     │ Reports             │
                     │ Projects            │
                     │ Versions            │
                     │ Review History      │
                     └─────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

- ⚛️ React
- React Router
- Axios / Fetch API
- Reusable components
- Responsive UI
- Form validation
- Charting library

## Backend

- 🟢 Node.js
- 🚂 Express.js
- REST API
- Authentication middleware
- Role-based authorization
- Request validation
- Service/controller architecture
- Centralized error handling

## Database

- 🍃 MongoDB
- Mongoose ODM

## Development Tools

- Git
- GitHub
- npm
- Postman
- ESLint
- Automated testing

---

# 📁 Project Structure

```text
team-weekly-reports/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       │   ├── auth/
│       │   ├── reports/
│       │   ├── dashboard/
│       │   ├── projects/
│       │   ├── users/
│       │   └── profile/
│       ├── routes/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── seed/
│   ├── tests/
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# 🗄️ Database Design

## User

```text
User
├── name
├── email
├── passwordHash
├── role
├── isActive
├── projects
├── createdAt
└── updatedAt
```

## Project

```text
Project
├── name
├── description
├── members
├── isActive
├── createdAt
└── updatedAt
```

## Weekly Report

```text
WeeklyReport
├── user
├── weekStart
├── weekEnd
├── project
├── tasksCompleted[]
├── tasksPlannedNextWeek[]
├── blockers[]
├── keyBlocker
├── achievements[]
├── keyAchievement
├── hoursWorked[]
├── notes
├── status
├── latestReviewerComment
├── currentVersion
├── submittedAt
├── approvedAt
├── createdAt
└── updatedAt
```

## Report Version

```text
ReportVersion
├── report
├── versionNumber
├── contentSnapshot
├── submittedAt
├── submittedBy
└── createdAt
```

## Review History

```text
ReviewHistory
├── report
├── version
├── reviewer
├── action
├── comment
└── createdAt
```

---

# 🔌 REST API

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Reports

```http
GET  /api/reports
POST /api/reports
GET  /api/reports/:id
PUT  /api/reports/:id
POST /api/reports/:id/submit
GET  /api/reports/:id/versions
GET  /api/reports/:id/versions/:versionId
```

## Manager Review

```http
GET  /api/reports/review/pending
POST /api/reports/:id/approve
POST /api/reports/:id/request-correction
```

## Projects

```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

## Users

```http
GET   /api/users
GET   /api/users/:id
POST  /api/users
PUT   /api/users/:id
DELETE /api/users/:id
PATCH /api/users/:id/role
```

## Dashboard

```http
GET /api/dashboard/summary
GET /api/dashboard/task-trends
GET /api/dashboard/report-status
GET /api/dashboard/project-workload
GET /api/dashboard/time-distribution
GET /api/dashboard/activity
```

> List endpoints support filtering and/or pagination for scalable report management.

---

# 🔒 Security

Security is implemented across both frontend and backend layers.

### Password Protection

Passwords are securely hashed before being stored.

### Authentication

Protected endpoints require authenticated users.

### Role-Based Authorization

```text
TEAM_MEMBER
    │
    └── Own reports only

MANAGER
    │
    └── Team reports + review actions

ADMIN
    │
    └── Full administrative access
```

### Report Ownership

A team member cannot access another user's report by manually changing a report ID.

### Manager Restrictions

Managers can modify:

- Review status
- Review comments
- Review metadata

Managers cannot modify the team member's actual report content.

### Additional Security

- Input validation
- Authentication middleware
- Authorization middleware
- Secure password hashing
- Environment variables
- CORS configuration
- Centralized error handling
- No secrets committed to Git

---

# 🧪 Testing

Critical business and security rules are tested.

Recommended test coverage includes:

- Authentication
- Role-based authorization
- Report ownership
- Report submission
- Correction workflow
- Approval workflow
- Manager permissions
- Version creation
- Validation

### Example RBAC Test

```text
Team Member A
      │
      │ Attempts to access
      │ Team Member B's report
      ▼
┌─────────────────┐
│ Backend RBAC    │
│ Authorization   │
└────────┬────────┘
         │
         ▼
   403 Forbidden
```

Run tests:

```bash
npm test
```

---

# 🌱 Seed Data

The project includes seeded data for demonstration and evaluation.

The seed dataset contains:

- 👤 Admin
- 👨‍💼 Manager
- 👥 Multiple team members
- 🗂️ Multiple projects
- 📅 Several weeks of reports
- 📝 Draft reports
- 📤 Submitted reports
- 🔁 Needs Correction reports
- ✅ Approved reports
- 🚧 Blockers
- ⭐ Achievements
- 📚 Report versions
- 🔎 Review history

This allows the dashboard and review workflow to be demonstrated immediately.

---

# ⚙️ Installation

## Prerequisites

Make sure you have:

- Node.js 18+
- npm
- MongoDB or MongoDB Atlas
- Git

Check versions:

```bash
node --version
npm --version
```

---

## Clone the Repository

```bash
git clone https://github.com/DiluTharushika/YOUR-REPOSITORY-NAME.git

cd YOUR-REPOSITORY-NAME
```

---

## Install Backend Dependencies

```bash
cd server
npm install
```

---

## Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

# 🔑 Environment Variables

Create:

```text
server/.env
```

Example:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/team-weekly-reports

JWT_SECRET=your_secure_secret

CLIENT_URL=http://localhost:5173
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Never commit real environment variables, passwords, database credentials, or API keys to GitHub.

---

# ▶️ Run the Application

## Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🌱 Seed Database

Run:

```bash
npm run seed
```

This creates the demo users, projects, reports, statuses, and review history.

---

# 🤖 AI Chat Assistant

The application can optionally provide an AI assistant for managers.

Example questions:

> What did the team complete last week?

> Which blockers are affecting multiple team members?

> Which project consumed the most time?

> Summarize this week's achievements.

> Which team members have workload imbalances?

### Privacy Considerations

If an external AI provider is used:

- API keys remain on the backend
- Only required report data is sent
- Sensitive information should be minimized
- AI output should be treated as an analytical aid
- User permissions should be respected before retrieving report data

---

# 📱 Responsive Design

The application is designed to work across:

- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile

Responsive layouts are provided for:

- Navigation
- Report forms
- Task tables
- Dashboard cards
- Charts
- Filters
- Review screens
- Data tables

---

# 🎨 UI / UX

The application follows a clean and professional internal-business-tool design.

### Design principles

- Consistent navigation
- Reusable components
- Fixed report structure
- Clear status indicators
- Responsive tables
- Dashboard cards
- Data visualization
- Form validation
- Loading states
- Empty states
- Error feedback
- Confirmation dialogs

---

# 📸 Screenshots

Add your real screenshots here after uploading them to the repository.

### Login

```md
![Login](./docs/screenshots/login.png)
```

### Team Dashboard

```md
![Team Dashboard](./docs/screenshots/dashboard.png)
```

### Weekly Report

```md
![Weekly Report](./docs/screenshots/weekly-report.png)
```

### Manager Review

```md
![Manager Review](./docs/screenshots/review.png)
```

### Report History

```md
![Report History](./docs/screenshots/report-history.png)
```

---

# 🌐 Live Demo

### Application

[**Live Demo →**](YOUR_DEPLOYED_APP_URL)

### Backend API

[**API →**](YOUR_DEPLOYED_API_URL)

### GitHub Repository

[**Source Code →**](https://github.com/DiluTharushika/YOUR-REPOSITORY-NAME)

---

# 🔑 Demo Accounts

For evaluation purposes, add your seeded demo accounts here.

| Role | Email | Password |
|---|---|---|
| 🛡️ Admin | `admin@example.com` | `********` |
| 👨‍💼 Manager | `manager@example.com` | `********` |
| 👤 Team Member | `member@example.com` | `********` |

> Use non-sensitive demo credentials for public repositories.

---

# 📋 Requirements Coverage

| Requirement | Status |
|---|:---:|
| User Registration | ✅ |
| Login / Logout | ✅ |
| Authentication | ✅ |
| Role-Based Access Control | ✅ |
| Fixed Report Structure | ✅ |
| Draft Reports | ✅ |
| Report Submission | ✅ |
| Needs Correction Workflow | ✅ |
| Manager Approval | ✅ |
| Review Comments | ✅ |
| Report Version History | ✅ |
| Personal Report History | ✅ |
| Manager Dashboard | ✅ |
| Team Member Filtering | ✅ |
| Project Filtering | ✅ |
| Date Range Filtering | ✅ |
| Status Filtering | ✅ |
| Project CRUD | ✅ |
| User Management | ✅ |
| Team Member Profiles | ✅ |
| Dashboard Analytics | ✅ |
| Recent Activity | ✅ |
| Seeded Dataset | ✅ |
| REST API | ✅ |
| Request Validation | ✅ |
| Backend RBAC | ✅ |
| Responsive UI | ✅ |
| Automated Testing | ✅ |
| AI Assistant | ⭐ Optional |

---

# 🚀 Future Enhancements

Possible future improvements:

- 📧 Automated email reminders
- 🔔 Slack notifications
- 💬 Microsoft Teams integration
- 📅 Calendar integration
- 📄 PDF/CSV exports
- 🔐 Two-factor authentication
- 🏢 SSO integration
- 📊 Advanced analytics
- 🔍 Full report diff comparison
- 🤖 Advanced AI-generated team summaries
- 📱 Progressive Web App support
- 🧾 Advanced audit logging

---

# 🏆 Project Highlights

This project demonstrates practical full-stack development skills in:

- MERN stack development
- React application architecture
- Node.js and Express API development
- MongoDB data modeling
- Authentication
- Role-based authorization
- REST API design
- CRUD operations
- Business workflow management
- Report versioning
- Dashboard development
- Data visualization
- Responsive UI
- Form validation
- API security
- Automated testing

---

# 👩‍💻 Author

<div align="center">

## Dilu Tharushika

Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-DiluTharushika-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DiluTharushika)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](YOUR_LINKEDIN_URL)

</div>

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.

---

<div align="center">

### ⭐ If you found this project useful, please consider giving it a star!

**Built with ❤️ using the MERN Stack**

</div>
