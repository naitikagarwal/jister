import { Routes, Route } from 'react-router-dom'
// import Auth from './Auth'
// import Dashboard from './Dashboard'
import { ProtectedRoute } from './ProtectedRoute'
import AuthPage from './pages/auth'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <>HI</>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App