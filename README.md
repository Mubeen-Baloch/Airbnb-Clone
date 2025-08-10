# Airbnb Clone Listing App

A full-stack Airbnb-style listing application built with React, Node.js, Express, and MongoDB. Features user authentication (email/password & Google OAuth), listing management, image upload, reviews/ratings, wishlist, calendar availability, and more.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Multer, Passport.js (Google OAuth), JWT
- **API Docs:** Swagger (see `/api-docs`)
- **Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas

## Features
- Register/login (email/password & Google)
- Browse, search, filter, and sort listings
- Create, edit, delete your listings
- Upload images for listings
- View single listing with reviews, calendar, wishlist
- Add/edit/delete reviews and ratings
- Wishlist/bookmark listings
- Set calendar availability for listings
- User profile (view/edit)
- Protected routes

## Getting Started

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   - `PORT=5000`
   - `MONGO_URI=...`
   - `JWT_SECRET=...`
   - `JWT_EXPIRE=30d`
   - `UPLOAD_FOLDER=uploads`
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
   - `FRONTEND_URL=http://localhost:3000`
4. `npm start`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

### API Documentation
- Visit [https://airbnb-backend-api-4b18.onrender.com/api-docs](https://airbnb-backend-api-4b18.onrender.com) for Swagger API Docs.

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Screenshots
(Add screenshots here)

---

**For more details, see the code and Swagger docs!** 
