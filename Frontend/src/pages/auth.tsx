import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast, Toaster } from 'sonner';

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  // const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mode = searchParams.get('mode')
    setIsSignup(mode === 'signup')
  }, [searchParams])
  
  
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // setError(null)
    // setMessage('');

    try {
      if (isSignup) {
        // Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name  // this will be stored in user_metadata
              }
            }
          })
  
          if (authError) throw authError
  
          // Create user in public.users table
          const { error: userError } = await supabase
            .from('users')
            .insert([{
              email,
              name,
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
          toast.success('Signup successful!')
      } else {
        // Login logic
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
  
          if (error) {
            // throw error
            toast.error(error.message)
            return
          }
  
          // Update last active time
          await supabase
            .from('users')
            .update({
              stats: {
                last_active: new Date().toISOString()
              }
            })
            .eq('email', email)
            toast.success('Login successful!')
            setTimeout(() => navigate('/problemset'), 500)
            
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Toaster richColors />
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
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
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
              <div className="relative">
                <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
              <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 cursor-pointer"
              >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              </div>
              
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
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-gray-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button 
              variant="link" 
              onClick={() => {
                setIsSignup(!isSignup);
                // setError('');
              }} 
              className="p-0 font-semibold cursor-pointer"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
