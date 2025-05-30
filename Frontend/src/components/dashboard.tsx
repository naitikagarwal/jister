import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { format, parseISO, eachDayOfInterval, subDays, isSameDay } from 'date-fns'

interface UserStats {
  correct: number
  attempted: string[]
  incorrect: number
  bookmarked: string[]
  active_days: string[]
  last_active: string
}

interface Question {
  id: string
  question: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

export function StudentDashboard({ userId }: { userId: string }) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [attemptedQuestions, setAttemptedQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Fetch user stats
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('stats')
          .eq('id', userId)
          .single()
        
        if (userError) throw userError
        
        if (userData?.stats) {
          setStats(userData.stats)
          
          // Fetch attempted questions
          const { data: questionsData, error: questionsError } = await supabase
            .from('questions')
            .select('*')
            .in('id', userData.stats.attempted)
          
          if (questionsError) throw questionsError
          
          setAttemptedQuestions(questionsData || [])
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  if (!stats) {
    return <div>No stats data available</div>
  }

  // Generate last 90 days for the activity calendar
  const today = new Date()
  const startDate = subDays(today, 89) // 90 days total (including today)
  const dateRange = eachDayOfInterval({ start: startDate, end: today })

  return (
    <div className="space-y-6 mx-w-7xl mx-auto p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-green-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4 12 14.01l-3-3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.correct}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attempted Questions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-blue-500"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attempted.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incorrect Answers</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-red-500"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incorrect}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-yellow-500"
            >
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.attempted.length > 0
                ? `${Math.round((stats.correct / stats.attempted.length) * 100)}%`
                : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">

        <Card className="w-ful px-3">
          <CardHeader>
            <CardTitle>Activity Calendar</CardTitle>
            <CardDescription>
              Your daily coding activity (last 90 days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {dateRange.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd')
                const isActive = stats.active_days.some((activeDay) =>
                  isSameDay(parseISO(activeDay), day)
                )
                
                return (
                  <div
                    key={dayStr}
                    className={`h-4 w-4 rounded-sm ${isActive ? 'bg-green-500' : 'bg-gray-100'}`}
                    title={`${format(day, 'MMM d, yyyy')}: ${isActive ? 'Active' : 'Inactive'}`}
                  />
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-sm bg-gray-100" />
                <span>Less</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-sm bg-green-500" />
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Attempted Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attemptedQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">{question.question}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          question.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-800'
                            : question.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {stats.attempted.includes(question.id) ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                          Attempted
                        </span>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}