import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
// import { useToast } from '@/components/ui/use-toast'
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Icons } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/AuthProvider';


export default function ProblemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const [question, setQuestion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [timerActive])

  // Fetch question
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        
        setQuestion(data)
        setTimerActive(true)
      } catch (error) {
        console.error('Error fetching question:', error)
        toast.error('Failed to load question')
        navigate('/problemset')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  const handleSubmit = () => {
    if (!selectedOption) {
      toast.error('Please select an answer')
      return
    }

    setSubmitted(true)
    setTimerActive(false)

    // Update user stats in the users table
    if (question) {
      supabase.rpc('update_user_stats', {
        user_email: session?.user.email,
        question_id: question.id,
        is_correct: selectedOption === question.correct_answer,
        time_taken: timeElapsed
      })
    }

    // Show feedback
    const isCorrect = selectedOption === question?.correct_answer
    // toast.success(isCorrect ? 'Correct!' : 'Incorrect')
    toast(isCorrect ? 'Great job! You answered correctly.' : `The correct answer is ${question?.correct_answer}`)
    // toast({
    //   title: isCorrect ? 'Correct!' : 'Incorrect',
    //   description: isCorrect 
    //     ? 'Great job! You answered correctly.'
    //     : `The correct answer is ${question?.correct_answer}`,
    //   variant: isCorrect ? 'default' : 'destructive',
    // })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!question) {
    return (
      <div className="p-4 text-center">
        <p>No question found.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/problemset')}
        >
          Back to Problems
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Toaster richColors />
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Icons.clock className="h-5 w-5" />
          <span className="font-mono">{formatTime(timeElapsed)}</span>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary">{question.subject}</Badge>
          <Badge variant="outline">{question.type}</Badge>
          <Badge 
            variant={question.difficulty === 'Easy' 
              ? 'default' 
              : question.difficulty === 'Medium' 
                ? 'secondary' 
                : 'destructive'
            }
          >
            {question.difficulty}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedOption || undefined}
            onValueChange={setSelectedOption}
            className="space-y-3"
            disabled={submitted}
          >
            {Object.entries(question.options).map(([key, value]) => (
              <div 
                key={key} 
                className={`flex items-center space-x-2 p-3 rounded-md border ${
                  submitted && key === question.correct_answer 
                    ? 'bg-green-50 border-green-300'
                    : submitted && key === selectedOption && key !== question.correct_answer
                      ? 'bg-red-50 border-red-300'
                      : 'hover:bg-gray-50'
                }`}
              >
                <RadioGroupItem 
                  value={key} 
                  id={`option-${key}`} 
                />
                <Label 
                  htmlFor={`option-${key}`} 
                  className={`cursor-pointer ${
                    submitted && key === question.correct_answer 
                      ? 'text-green-700 font-medium'
                      : ''
                  }`}
                >
                  {String(value)}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="mt-6 pt-4 border-t">
            {!submitted ? (
              <Button onClick={handleSubmit}>
                Submit Answer
              </Button>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Explanation:</h3>
                  <p className="text-sm text-muted-foreground">
                    {question.solution || 'No explanation available.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/problemset')}
                  >
                    Back to Problems
                  </Button>
                  <Button 
                    onClick={() => {
                      setSelectedOption(null)
                      setSubmitted(false)
                      setTimeElapsed(0)
                      setTimerActive(true)
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}