import { Routes, Route } from 'react-router-dom'
// import Auth from './Auth'
// import Dashboard from './Dashboard'
import { ProtectedRoute } from './ProtectedRoute'
import AuthPage from './pages/auth'
// import Problem from './pages/problem'
import Problems from './pages/problem'
import Navbar from './components/nav'
import HomePage from './pages/home'
function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
        path="/problemset"
        element={
          <ProtectedRoute>
            <Problems/>
          </ProtectedRoute>
        }
      />
    </Routes>
    </div>
  )
}

export default App