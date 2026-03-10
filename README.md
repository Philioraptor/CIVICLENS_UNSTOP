# CivicLens — Hyper-Local Civic Transparency Platform

A location-aware civic information system that informs citizens about government projects, public infrastructure, and schemes happening near them using geo-fencing and AI-generated summaries. 

The goal is to make governance visible, understandable, and locally relevant.

---

## 🔒 Security Checklist (Pre-Deployment)

Before deploying or sharing this repository, ensure the following security measures are strictly followed:

- [x] **`.gitignore` Configured**: The root `.gitignore` is set up to ignore `.env` files. **Never commit your `.env` files containing real API keys or database URIs!**
- [x] **MongoDB Atlas Security**:
  - Store your MongoDB URI in `backend/.env` only.
  - In MongoDB Atlas, ensure **Database Access** uses a strong, dedicated user (e.g., `dhruvm05062004_db_user`).
  - In **Network Access**, use `0.0.0.0/0` (Allow Access from Anywhere) only if deploying to cloud platforms like Railway/Render. Alternatively, whitelist explicit IP addresses for maximum security.
- [x] **JWT Secret Strength**: Change the `JWT_SECRET` in `backend/.env` to a long, cryptographically secure random string before production.
- [x] **Admin Route Protection**: Backend routes (e.g., `POST /api/projects`) and frontend Admin views are protected by role-based middleware (`user.role === 'admin'`).
- [x] **File Upload Security**: Allowed file sizes for `multer` image uploads are capped at 5MB to prevent storage exhaustion attacks.

---

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Leaflet (Maps) & React-Leaflet
- Lucide React (Icons)
- React Hot Toast (Notifications)

**Backend:**
- Node.js & Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) & bcrypt (Authentication)
- Multer (File Uploads)

---

## 🛠️ Local Setup Instructions

### 1. Database Setup

1. Create a free cluster on [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a database user and whitelist your IP (or `0.0.0.0/0`).
3. Get your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.../civiclens`).

### 2. Backend Environment Variables

Navigate to `backend/` and copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `backend/.env` with your actual values:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_super_secret_string
CLIENT_URL=http://localhost:5173
HUGGING_FACE_API_KEY=your_optional_ai_key
```

### 3. Frontend Environment Variables

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Running the Development Servers

Open two terminals in the root of the project:

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```
The app will now be running at `http://localhost:5173`.

---

## ☁️ Deployment Guide

### Backend (Railway / Render)
1. Import the repository into your PaaS provider.
2. Set the Root Directory to `backend/` (or run `cd backend && npm install && npm start`).
3. Add the exact environment variables from your `backend/.env` into the platform's Environment Settings.
4. (Optional) Railway users can deploy seamlessly using the provided `railway.toml`.

### Frontend (Vercel / Netlify)
1. Import the repository into Vercel.
2. Set the Root Directory to `frontend/`.
3. Set the Build Command to `npm run build` and Output Directory to `dist`.
4. Add `VITE_API_URL` to the Environment Variables pointing to your deployed backend URL.
5. The predefined `vercel.json` ensures that React Router works properly (SPA fallback).

---

## ⚠️ Important Note on Frontend Package Validation

When working locally, depending on Vite and your system setup, be mindful of directory locks. Always ensure your IDE or text editor is closed before running file-level rename commands to avoid `Access Denied` permission errors in Windows.

*CivicLens is built to empower citizens with data. Keep it secure, maintain its integrity, and build for transparency.*
