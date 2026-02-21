# 🎉 Gatherly - Event & Community Platform

A modern, full-stack event management and community platform with real-time features, built with the MERN stack.

---

## ✨ Features

- 🎭 **Unique Cute Usernames** - Auto-generated playful display names  
- 🐧 **Penguin Companion** - Adorable cursor-following companion with animations  
- ⚡ **Real-Time Events** - Live updates via Socket.io  
- 🎵 **Event Categories** - Filter by Concerts, Travel, or Trekking  
- 🔐 **Public & Private Events** - Join via approval or join code  
- 💬 **Group Chat** - Real-time chat for each event  
- 👤 **User Profiles** - Customizable profiles with avatars and activity tracking  
- 🛠 **Event Management** - Creators can manage join requests and delete events  
- 🎨 **Modern UI** - Clean UI built with Tailwind + Radix UI  

---

## 🚀 Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Socket.io Client
- Zustand (State Management)
- Radix UI Components
- Framer Motion

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- bcrypt
- AWS S3 (for image handling)

---

## 📦 Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or MongoDB Atlas)
- npm

---

## ⚙️ Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/PranjalRathi1/gatherly.git
cd gatherly
```

---

### 2️⃣ Backend Setup

```bash
cd gatherly-backend
npm install
```

Create a `.env` file inside `gatherly-backend`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5002
NODE_ENV=development
```

Start backend:

```bash
npm start
```

Backend runs on:
```
http://localhost:5002
```

---

### 3️⃣ Frontend Setup

```bash
cd app
npm install
```

Create `.env.local` inside `app`:

```
VITE_API_URL=http://localhost:5002/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🎯 Core Functionality

### 🔓 Public Events
Users can instantly join public events until max capacity is reached.

### 🔐 Private Events
Users must:
- Enter a join code OR
- Send a request for approval

Creators can:
- Approve / Reject join requests
- Delete events
- Access event management panel

### 💬 Real-Time Chat
- Each event has its own chat room
- Built using Socket.io
- Only attendees can access chat

---

## 🛠 Development Commands

### Backend
```bash
npm start
```

### Frontend
```bash
npm run dev
```

### Production Build (Frontend)
```bash
npm run build
```

---

## 📁 Project Structure

```
gatherly/
│
├── app/                 # React Frontend
│
└── gatherly-backend/    # Express Backend
```

---

## 🌍 Deployment Ready

Frontend:
- Can be deployed on Vercel / Azure / AWS

Backend:
- Can be deployed on AWS EC2 / Azure VM
- MongoDB Atlas recommended for production database

---

## 🤝 Contributing

Pull requests are welcome.  
For major changes, please open an issue first.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built by **Pranjal Rathi** 🚀  
B.Tech CSE | Full Stack Developer