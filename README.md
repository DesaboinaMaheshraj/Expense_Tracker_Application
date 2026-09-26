<<<<<<< HEAD
# Expense Tracker MERN Project

College-level MERN Expense Tracker with:

- Registration
- Login
- Logout
- Dashboard
- Expense management
- Income management
- Monthly budget
- Budget usage tracking
- Financial reports
- Recharts charts
- Expense category report
- Profile update
- Search and filters
- Responsive UI

## Important project requirement

This project intentionally does NOT implement JWT, sessions, authentication middleware, or authorization middleware.

Passwords are stored as plain text for this educational project. Do not use this approach for a real production application.

## Backend setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
```

Start:

```bash
npm start
```

Development:

```bash
npm run dev
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Optional `.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Vercel + Render

For the Vercel frontend, add:

```text
VITE_API_URL=https://YOUR-RENDER-BACKEND-URL
```

Then redeploy the frontend.

For Render backend, make sure the service root directory points to `backend` if deploying this monorepo with separate frontend/backend folders. Use:

Build command:
```text
npm install
```

Start command:
```text
npm start
```

Set `MONGO_URI` in Render environment variables.

## Main API endpoints

- POST `/register`
- POST `/login`
- POST `/expenses`
- GET `/expenses/user/:userId`
- GET `/expenses/:id`
- PUT `/expenses/:id`
- DELETE `/expenses/:id`
- POST `/income`
- GET `/income/user/:userId`
- GET `/dashboard/:userId`
- POST `/budget`
- GET `/budget/:userId/:month/:year`
- GET `/reports/:userId`
- PUT `/profile/:userId`
=======
# Expense_Tracker_Application
A Tracker Application
>>>>>>> 6e078e4d706c6afccced47a0c3f779be19ba6685
