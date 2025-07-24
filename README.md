# CircleVerse – Share Your Imagination

**CircleVerse** is a full-stack social media platform where verified celebrities can create and share content, while public users can follow, interact, and stay connected — all within a sleek, role-based, and theme-personalized environment.

---

## 🔐 Authentication & Security

* Role-based Sign Up / Login (Celebrity or Public)
* Email OTP verification & password reset via email
* JWT-based session management
* Auth pages (login, signup, verify, reset) always load in light mode

## ⭐ Celebrity Features

* Verified badge shown on profile, sidebar, and suggestions
* Create and share image/video posts
* Edit your profile (avatar, bio)

## 👥 Public User Features

* Follow/unfollow celebrities
* Like, comment, and save posts

## 🤝 Common Features

* View public profiles
* Suggested users (celebrities)
* Dark mode preference saved to DB and applied on login
* Fully responsive and mobile-friendly UI
* Real-time updates via WebSockets
* Clean and interactive interface with toasts and modals

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Redux Toolkit, Tailwind CSS, Lucide Icons
* **Backend:** Node.js, Express.js, MongoDB, JWT, Cloudinary, Multer, Nodemailer
