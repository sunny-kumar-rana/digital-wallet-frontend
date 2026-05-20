import { Routes, Route } from "react-router-dom"

function LoginPage() {
  return <h1>Login Page</h1>
}

function RegisterPage() {
  return <h1>Register Page</h1>
}

function DashboardPage() {
  return <h1>Dashboard</h1>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default App