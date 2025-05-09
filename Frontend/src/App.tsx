import { Routes, Route } from 'react-router-dom'
// import Auth from './Auth'
// import Dashboard from './Dashboard'
import { ProtectedRoute } from './ProtectedRoute'
import AuthPage from './pages/auth'
// import Problem from './pages/problem'
import Problems from './pages/problem'

function App() {
  return (
    <Routes>
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
  )
}

export default App