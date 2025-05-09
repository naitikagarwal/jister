import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'

import { User, Menu, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton'
import { supabase } from '@/lib/supabase'
// import { Input } from './ui/input';

export default function Navbar() {
    
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div>Jister</div>
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </header>
    )
  }

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-yellow-500">Jister</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="text-sm font-medium text-gray-900 px-3 py-2 hover:bg-gray-100 rounded-md group"
                    >
                      <div className="flex items-center border-b-2 border-yellow-500 pb-1 px-1">
                        Problems
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  {/* <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 data-[state=open]:bg-gray-100 rounded-md">
                      Explore
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-2 p-2 w-48">
                        <NavigationMenuLink className="px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                          Study Plan
                        </NavigationMenuLink>
                        <NavigationMenuLink className="px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                          Featured Lists
                        </NavigationMenuLink>
                        <NavigationMenuLink className="px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                          Interview
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                   */}
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 hover:bg-gray-100 rounded-md"
                    >
                      Mock Test
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 hover:bg-gray-100 rounded-md"
                    >
                      Discuss
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>


          {/* Right navigation and actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="text-sm font-medium">{user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.user_metadata?.full_name || 'JEE Aspirant'}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/problems')}>
                  Problems
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/auth?mode=login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/auth?mode=signup')}>
                Sign Up
              </Button>
            </div>
          )}

          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-gray-500" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <div className="flex flex-col h-full px-4">
                  <div className="py-4 ">
                    
                    <div className="flex items-center mb-6">
                      {/* Avatar  */}
                      {user ? (
                        <div className="flex flex-col gap-2">
                        <Avatar className="h-10 w-10 ">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.user_metadata?.full_name || 'JEE Aspirant'}
                      </div>
                      </div>
                      ):(
                        <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-gray-200">
                          <User className="h-6 w-6 text-gray-500" />
                        </AvatarFallback>
                      </Avatar>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start pl-2 font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100">
                        Problems
                      </Button>
                      <div className="relative">
                        {/* <Button variant="ghost" className="w-full justify-between pl-2">
                          Explore
                          <ChevronDown className="h-4 w-4" />
                        </Button> */}
                      </div>
                      <Button variant="ghost" className="w-full justify-start pl-2">
                        Mock Test
                      </Button>
                      <Button variant="ghost" className="w-full justify-start pl-2">
                        Discuss
                      </Button>
                    </div>

                  </div>
                  
                  <div className="mt-auto border-t py-2">
                    <div className="grid grid-cols-2 gap-2">
                    {user ? (
                      <div className="flex gap-2">
                      <Button onClick={handleLogout}  size="sm" className="bg-red-700 hover:bg-red-800">
                        Logout
                      </Button>
                    </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate('/auth?mode=login')}>
                          Login
                        </Button>
                        <Button onClick={() => navigate('/auth?mode=signup')}>
                          Sign Up
                        </Button>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}