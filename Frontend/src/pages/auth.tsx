import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null)
    // setMessage('');

    try {
      if (isSignup) {
        // Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
          })
  
          if (authError) throw authError
  
          // Create user in public.users table
          const { error: userError } = await supabase
            .from('users')
            .insert([{
              email,
              username,
              stats: {
                attempted: [],
                correct: 0,
                incorrect: 0,
                bookmarked: [],
                active_days: [],
                last_active: new Date().toISOString()
              }
            }])
  
          if (userError) throw userError
  
          alert('Signup successful!')
      } else {
        // Login logic
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
  
          if (error) throw error
  
          // Update last active time
          await supabase
            .from('users')
            .update({
              stats: {
                last_active: new Date().toISOString()
              }
            })
            .eq('email', email)
  
            navigate('/dashboard')
      }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">{isSignup ? 'Create an Account' : 'Welcome Back'}</h2>
          <p className="text-center text-gray-500 text-sm">
            {isSignup ? 'Sign up to get started' : 'Enter your credentials to continue'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignup ? 'Creating Account...' : 'Logging in...'}
                </>
              ) : (
                isSignup ? 'Sign Up' : 'Login'
              )}
            </Button>
          </form>
          {error && (
            <div className={`mt-4 p-3 rounded-md ${error.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-gray-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button 
              variant="link" 
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }} 
              className="p-0 font-semibold"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
