# Digital Wallet — Frontend

A modern React frontend for the Digital Wallet application.

The frontend provides the user-facing interface for authentication, wallet management, money transfers, balance viewing, and transaction history. It communicates with a Spring Boot REST API through Axios and uses JWT-based authentication for protected operations.

The application is deployed on Vercel and connects to the production Spring Boot backend deployed on Render.

---

# Live Application

**Frontend:**
https://digitalwallet-su.vercel.app

**Backend API:**
https://digital-wallet-api-6465.onrender.com

**Backend Health:**
https://digital-wallet-api-6465.onrender.com/actuator/health

**Swagger UI:**
https://digital-wallet-api-6465.onrender.com/swagger-ui.html

---

# Features

## Authentication

- User registration
- User login
- JWT authentication
- JWT token persistence using `localStorage`
- Automatic JWT attachment to protected API requests
- Protected dashboard route
- Automatic handling of `401 Unauthorized`
- Logout functionality
- Redirect to login after authentication failure

## Wallet

- Display authenticated user's wallet balance
- Deposit money
- Withdraw money
- Transfer money to another user
- Client-side input validation
- Loading states during wallet operations
- Success and error notifications

## Transactions

- Transaction history
- Transaction type display
- Transaction amount display
- Transaction status display
- Transaction timestamp display
- Automatic refresh of transaction data after wallet operations

## User Experience

- Responsive interface
- Form validation
- Loading states
- Disabled states during operations
- Toast notifications
- Protected navigation
- Clean dashboard interface
- Error handling for failed API requests

---

# Tech Stack

## Core

- React 19
- Vite
- JavaScript
- Tailwind CSS

## Routing

- React Router DOM 7

## API Communication

- Axios

## Notifications

- React Hot Toast

## Development & Quality

- ESLint
- Vite development server
- npm

## Deployment

- Vercel

---

# Application Architecture

The frontend follows a simple page/component/service architecture.

```text
React Application
│
├── Authentication
│   ├── Login
│   └── Registration
│
├── Routing
│   └── Protected Routes
│
├── Pages
│   ├── LoginPage
│   ├── RegisterPage
│   └── DashboardPage
│
├── Components
│   └── ProtectedRoute
│
├── API Service
│   └── Axios instance
│       ├── Base API URL
│       ├── JWT request interceptor
│       └── 401 response handling
│
└── Styling
    └── Tailwind CSS
```

---

# Authentication Flow

The frontend uses the JWT issued by the Spring Boot backend.

```text
                 ┌──────────────────┐
                 │   Login Page     │
                 └────────┬─────────┘
                          │
                          │ POST /login
                          ▼
                 ┌──────────────────┐
                 │ Spring Boot API  │
                 └────────┬─────────┘
                          │
                          │ JWT
                          ▼
                 ┌──────────────────┐
                 │   localStorage   │
                 │     token        │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Protected Route  │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │    Dashboard     │
                 └──────────────────┘
```

For protected requests, the Axios interceptor automatically adds:

```http
Authorization: Bearer <jwt-token>
```

The frontend does not require individual pages to manually construct the authorization header.

---

# API Integration

API communication is centralized in:

```text
src/services/api.js
```

The Axios instance obtains its backend URL from the Vite environment configuration:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

The JWT is automatically attached to requests when a token exists in `localStorage`.

If the backend returns `401 Unauthorized`, the frontend:

1. Removes the stored JWT.
2. Removes the stored user name.
3. Redirects the user to the login page.

This keeps authentication handling centralized rather than duplicating it across individual pages.

---

# Pages

## Login Page

File:

```text
src/pages/LoginPage.jsx
```

Responsibilities:

- User authentication
- Login form
- Backend API integration
- JWT storage
- Redirect to dashboard
- Error handling
- Loading state

---

## Register Page

File:

```text
src/pages/RegisterPage.jsx
```

Responsibilities:

- New user registration
- Form validation
- Backend API integration
- Success/error feedback
- Redirect to login after registration

---

## Dashboard

File:

```text
src/pages/DashboardPage.jsx
```

Responsibilities:

- Display wallet balance
- Deposit money
- Withdraw money
- Transfer money
- Display transaction history
- Handle wallet operation states
- Display success/error notifications
- Logout

---

# Protected Routes

Protected routing is implemented using:

```text
src/components/ProtectedRoute.jsx
```

The dashboard is accessible only when a valid authentication token is present in the browser.

Conceptually:

```text
User requests /dashboard
        │
        ▼
ProtectedRoute
        │
        ├── Token exists
        │      │
        │      ▼
        │   Dashboard
        │
        └── No token
               │
               ▼
             Login
```

---

# Project Structure

```text
digital-wallet-frontend/
│
├── public/
│   └── favicon.svg
│
├── src/
│   │
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
└── vite.config.js
```

---

# Environment Configuration

The backend API URL is configured using a Vite environment variable.

```text
VITE_API_URL
```

## Local Development

Create a local environment file if required:

```text
.env
```

Example:

```env
VITE_API_URL=http://localhost:8080
```

## Production

The deployed Vercel application uses:

```text
VITE_API_URL=https://digital-wallet-api-6465.onrender.com
```

Production environment variables should be configured through the deployment platform rather than committed to the repository.

---

# Running Locally

## Prerequisites

- Node.js
- npm
- Running Digital Wallet Spring Boot backend

## Install Dependencies

```bash
npm install
```

## Configure Backend URL

For local development:

```env
VITE_API_URL=http://localhost:8080
```

## Start Development Server

```bash
npm run dev
```

The development application runs at:

```text
http://localhost:5173
```

---

# Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# Code Quality

Run ESLint:

```bash
npm run lint
```

The project is configured with ESLint for detecting JavaScript and React issues.

The production build is verified using:

```bash
npm run build
```

---

# Vercel Deployment

The frontend is deployed using Vercel.

Production URL:

https://digitalwallet-su.vercel.app

The project uses a Vercel rewrite configuration to support client-side React Router navigation.

`vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that directly refreshing routes such as:

```text
/dashboard
```

is handled by the React application instead of returning a Vercel `404`.

---

# Frontend ↔ Backend Architecture

```text
┌──────────────────────────────┐
│       React Frontend         │
│                              │
│ React 19 + Vite              │
│ React Router                 │
│ Axios                        │
│ Tailwind CSS                 │
└──────────────┬───────────────┘
               │
               │ HTTPS / REST
               │ JWT
               ▼
┌──────────────────────────────┐
│      Spring Boot API         │
│                              │
│ Spring Security              │
│ JWT Authentication           │
│ REST Controllers             │
│ Business Services            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        PostgreSQL            │
│                              │
│ Users                        │
│ Wallets                      │
│ Transactions                 │
│ Idempotency Records          │
└──────────────────────────────┘
```

---

# Backend API Used

The frontend communicates with the following backend operations:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate user |
| GET | `/balance` | Retrieve wallet balance |
| POST | `/deposit` | Deposit money |
| POST | `/withdraw` | Withdraw money |
| POST | `/transfer` | Transfer money |
| GET | `/transactions` | Retrieve transaction history |

For transfers, the frontend generates a unique idempotency key using:

```javascript
crypto.randomUUID()
```

This key is sent with the transfer request so the backend can prevent duplicate processing.

---

# Error Handling

The frontend handles common API failure scenarios including:

- Invalid login credentials
- Registration errors
- Invalid wallet amounts
- Failed deposits
- Failed withdrawals
- Failed transfers
- Authentication expiration
- Unauthorized API responses
- Network/API failures

User-facing feedback is displayed using toast notifications.

---

# Security Considerations

The frontend follows several security-related practices:

- JWT is required for protected API operations.
- Authorization headers are added centrally through Axios.
- User identity is not supplied as a sender ID for wallet operations.
- The backend determines the authenticated user from the JWT.
- Production API configuration is supplied through environment variables.
- Production secrets are not committed to the repository.
- Unauthorized sessions are cleared when the backend returns `401`.

> Note: JWT storage in `localStorage` is a deliberate implementation choice for this portfolio project. A production system handling highly sensitive financial data could use a different token/session architecture, such as secure, HTTP-only cookies with appropriate CSRF protections.

---

# Current Status

**Deployed and integrated with the production backend.**

Current implementation includes:

- React 19 frontend
- Vite build system
- Tailwind CSS
- React Router
- JWT authentication
- Protected routes
- Axios API integration
- Automatic JWT request handling
- `401` authentication handling
- Login
- Registration
- Logout
- Wallet balance
- Deposit
- Withdrawal
- Money transfer
- Transaction history
- Form validation
- Loading states
- Toast notifications
- Responsive interface
- Vercel deployment
- Production backend integration
- SPA routing configuration

---

# Future Improvements

Potential future improvements include:

- Refresh-token authentication
- More advanced transaction filtering
- Transaction pagination
- Enhanced dashboard analytics
- Improved mobile-first layouts
- Additional wallet statistics
- Accessibility improvements
- Automated frontend testing
- End-to-end testing
- Progressive Web App support

---

# Related Repository

The Spring Boot backend is maintained separately.

**Backend repository:**
https://github.com/sunny-kumar-rana/digital-wallet-springboot

**Frontend repository:**
https://github.com/sunny-kumar-rana/digital-wallet-frontend

---

# Author

**Sunny**

GitHub:

https://github.com/sunny-kumar-rana