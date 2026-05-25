# Digital Wallet Frontend

A React frontend for the Digital Wallet application.

The frontend communicates with the Spring Boot backend using REST APIs.

---

# Tech Stack

- React
- Vite
- Axios
- React Router DOM
- Tailwind CSS

---

# Features Implemented

## Authentication UI
- User Registration Page
- User Login Page
- Login persistence using localStorage
- Logout functionality

---

## Dashboard
- Wallet balance display
- Money transfer form
- Transaction history display
- Protected dashboard route

---

## Frontend Architecture
- Page-based structure
- API service layer using Axios
- Controlled React forms
- React Hooks
- Routing using React Router

---

# Pages

## Login Page
- Login form
- API integration
- Redirect after successful login

---

## Register Page
- Registration form
- Backend integration
- Redirect to login after registration

---

## Dashboard
- Balance display
- Transfer money
- Transaction history
- Logout

---

# Running the Frontend

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Backend Requirement

Backend must be running on:

```text
http://localhost:8080
```

---

# Project Structure

```text
src
│
├── components
├── pages
├── services
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

---

# Current Limitations

- No JWT handling
- No protected API requests
- No refresh token handling
- No loading states
- No notifications/toasts
- No profile management
- No responsive mobile optimization
- Minimal dashboard UI

---

# Future Plans

## Authentication
- JWT authentication
- Auto-login
- Session persistence
- Route guards

---

## UI Improvements
- Responsive dashboard
- Navbar/sidebar
- Better transaction cards
- Loading animations
- Toast notifications
- Dark mode

---

## Wallet Features
- Deposit money UI
- Withdraw money UI
- User profile section
- Transfer confirmation modal

---

## Advanced Features
- Charts and analytics
- Monthly transaction summaries
- Search/filter transactions
- Pagination
- Real-time updates

---

# Status

Frontend is currently functional and integrated with the Spring Boot backend.
