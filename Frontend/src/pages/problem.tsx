import { useState, useEffect } from 'react'
// import { useAuth } from '@/hooks/useAuth'
// import { supabase } from '@/lib/supabaseClient'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/AuthProvider'
import { useNavigate } from 'react-router-dom'

type Question = {
  id: string
  question: string
  options: Record<string, string>
  correct_answer: string
  solution: string
  subject: 'Physics' | 'Chemistry' | 'Math'
  type: 'JEE Main' | 'JEE Advanced'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  chapter: string
  year: number | null
  source: string | null
}

export default function Problems() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [attemptedIds, setAttemptedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    subject: '',
    chapter: '',
    search: '',
  })

  // Fetch questions and user attempts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // Fetch questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false })

        if (questionsError) throw questionsError

        if (questionsData) {
          setQuestions(questionsData)
          setFilteredQuestions(questionsData)
        }

        // Fetch user attempts if logged in
        if (session?.user?.email) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('stats->attempted')
            .eq('email', session.user.email)
            .single()

          if (userError) throw userError
          if (userData?.attempted) {
            // Ensure attempted is treated as string array
            const attempted = Array.isArray(userData.attempted) ? userData.attempted : [userData.attempted].filter(id => typeof id === 'string');
            setAttemptedIds(attempted as string[]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  // Apply filters
  useEffect(() => {
    let result = [...questions]
    
    if (filters.subject) {
      result = result.filter(q => q.subject === filters.subject)
    }
    
    if (filters.chapter) {
      result = result.filter(q => q.chapter === filters.chapter)
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(q =>
        q.question.toLowerCase().includes(searchLower) ||
        (q.chapter && q.chapter.toLowerCase().includes(searchLower))
      )
    }
    
    setFilteredQuestions(result)
  }, [filters, questions])


  const uniqueChapters = Array.from(new Set(
    questions
      .filter(q => !filters.subject || q.subject === filters.subject)
      .map(q => q.chapter)
      .filter(Boolean)
  )).sort()

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 ">
      <div className="flex flex-col md:flex-row gap-4 mb-6 mx-2">
        <Input
          placeholder="Search questions..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="max-w-md"
        />
        
        <Select
          value={filters.subject}
          onValueChange={(value) => setFilters({...filters, subject: value, chapter: ''})}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="subject">All Subjects</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Math">Mathematics</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.chapter}
          onValueChange={(value) => setFilters({...filters, chapter: value})}
          disabled={!filters.subject}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by chapter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All Chapters</SelectItem>
            {uniqueChapters.map(chapter => (
              <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border mx-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <TableRow
                  key={question.id}
                  className={
                    attemptedIds.includes(question.id) 
                      ? 'bg-green-100 hover:bg-green-50 cursor-pointer' 
                      : 'hover:bg-gray-50 cursor-pointer'
                  }
                  onClick={() => {
                    setSelectedQuestion(question)
                    setIsDialogOpen(true)
                  }}
                >
                  <TableCell>{question.subject}</TableCell>
                  <TableCell>{question.chapter || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {question.question.substring(0, 100)}...
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      question.difficulty === 'Easy' 
                        ? 'bg-green-100 text-green-800' 
                        : question.difficulty === 'Medium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </TableCell>
                  <TableCell>{question.type}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No questions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedQuestion?.subject} • {selectedQuestion?.chapter || 'General'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedQuestion && (
            <div className="space-y-4">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium">Question:</h3>
                <p>{selectedQuestion.question}</p>
                
                {/* <h3 className="text-lg font-medium mt-4">Options:</h3>
                <ul className="space-y-2">
                  {Object.entries(selectedQuestion.options).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}.</strong> {value}
                    </li>
                  ))}
                </ul> */}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedQuestion.question)
                  }}
                >
                  Copy Question
                </Button>
                
                  <Button
                    onClick={() => navigate(`/problem/${selectedQuestion.id}`)}
                  >
                    Attempt
                  </Button>
              </div>
              
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}