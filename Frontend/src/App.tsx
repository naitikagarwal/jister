import { Routes, Route } from 'react-router-dom'
// import Auth from './Auth'
// import Dashboard from './Dashboard'
import { ProtectedRoute } from './ProtectedRoute'
import AuthPage from './pages/auth'
// import Problem from './pages/problem'
import Problems from './pages/problem'
import Navbar from './components/nav'
import HomePage from './pages/home'
import ProblemDetail from './pages/problemdetails'
import { supabase } from './lib/supabase'
import { useEffect, useState } from 'react'

import type { User } from '@supabase/supabase-js'
import { StudentDashboard } from './components/dashboard'
import Mocktest from './pages/mocktest'

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        {user && <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard userId={user.id} /></ProtectedRoute>} />}
        <Route
        path="/problemset"
        element={
          <ProtectedRoute>
            <Problems/>
          </ProtectedRoute>
        }
      />
        <Route
        path="/mocktest"
        element={
          <ProtectedRoute>
            <Mocktest/>
          </ProtectedRoute>
        }
      />
        <Route
        path="/discuss"
        element={
          <ProtectedRoute>
            <Mocktest/>
          </ProtectedRoute>
        }
      />
      <Route path="/problem/:id" element={<ProblemDetail />} />
    </Routes>
    </div>
  )
}

export default App