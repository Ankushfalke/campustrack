# CampusTrack - AI Attendance & Truancy Detection System
## JSPM's BSIOTR, Wagholi | Computer Engineering 2025-26

---

## 🚀 Option 1: Vercel Deploy (EASIEST - FREE)

1. Go to https://vercel.com and sign up (free)
2. Click "New Project"
3. Upload this folder OR connect GitHub
4. Framework: Vite
5. Click Deploy → Get live URL in 60 seconds!

---

## 🚀 Option 2: Netlify Deploy (FREE)

1. Go to https://netlify.com
2. Drag & Drop the `dist/` folder onto the page
3. Done! Live URL instantly!

---

## 🚀 Option 3: GitHub Pages (FREE)

1. Create GitHub account at github.com
2. New repository → name: campustrack
3. Upload all files
4. Settings → Pages → Source: GitHub Actions
5. Add this vite.config.js base: '/campustrack/'
6. Live at: https://yourusername.github.io/campustrack

---

## 💻 Run Locally

```bash
# Install Node.js from nodejs.org first

npm install
npm run dev

# Opens at http://localhost:5173
```

## Build for Production
```bash
npm run build
# dist/ folder = ready to deploy anywhere
```

---

## 📁 Project Structure

```
campustrack/
├── src/
│   ├── App.jsx          ← Main application (all modules)
│   └── main.jsx         ← Entry point
├── dist/                ← Production build (deploy this!)
├── index.html
├── package.json
└── vite.config.js
```

---
## 🛠 Full Backend Stack (Future Integration)

- Python FastAPI → Face Recognition Service
- MongoDB Atlas → Database
- RabbitMQ → Message Queue
- Twilio → SMS/WhatsApp alerts
- SendGrid → Email alerts
- ESP32-CAM → Hardware feeds

