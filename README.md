# Blog Application

# USE MICROSOFT EDGE BROWSER (NOT CHROME) FOR IT TO RUN PROPERLY 
Chrome's new permission settings has been creating an issue with the sessions.

# Description
A full-stack blog platform with authentication, rich text editing, and auto-save functionality.

🔗 **Live Demo**: [https://blog-app-seven-tan.vercel.app/](https://blog-app-seven-tan.vercel.app/)

## Features

- ✅ User authentication (Login/Register/Logout)
- ✍️ Rich text blog editor with auto-save drafts
- 🏷️ Tagging system for blog posts
- 🔄 Real-time draft saving (every 30s or after 5s inactivity)
- 🔒 Role-based permissions (users can only edit their own posts)
- 📱 Fully responsive design

## Technologies Used

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios for API calls

### Backend
- Node.js
- Express
- MongoDB (with Mongoose)
- Express Session for authentication

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev