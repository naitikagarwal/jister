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
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

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
  const preprocessLatex = (text: string) => {
    return text.replace(/(\d+) \* 10 \^ - (\d+)/g, '$1 \\times 10^{-$2}');
  };

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

const handleSubmit = async () => {
  if (!selectedOption) {
    toast.error('Please select an answer');
    return;
  }
  setSubmitted(true);
  setTimerActive(false);
  if (!question || !session?.user?.email) return;
  
  try {
    const isCorrect = selectedOption === question.correct_answer;
    const today = new Date().toISOString().split('T')[0];
    
    // First, try to get existing user data
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('stats')
      .eq('email', session.user.email)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid errors when no record exists
    
    if (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
    
    const currentStats = existingUser?.stats || {
      attempted: [],
      correct: 0,
      incorrect: 0,
      bookmarked: [],
      active_days: [],
      last_active: null
    };
    
    // Update stats
    const updatedStats = {
      ...currentStats,
      attempted: currentStats.attempted.includes(question.id)
        ? currentStats.attempted
        : [...currentStats.attempted, question.id],
      correct: isCorrect ? currentStats.correct + 1 : currentStats.correct,
      incorrect: !isCorrect ? currentStats.incorrect + 1 : currentStats.incorrect,
      last_active: new Date().toISOString(),
      active_days: currentStats.active_days.includes(today)
        ? currentStats.active_days
        : [...currentStats.active_days, today]
    };
    
    // Use upsert to handle both insert and update cases
    const { error: upsertError } = await supabase
      .from('users')
      .upsert([{
        email: session.user.email,
        stats: updatedStats
      }], {
        onConflict: 'email',
        ignoreDuplicates: false
      });
    
    if (upsertError) {
      console.error('Upsert error:', upsertError);
      
      // Handle specific RLS errors
      if (upsertError.code === '42501') {
        toast.error('Authentication error. Please try logging out and back in.');
        return;
      }
      
      throw upsertError;
    }
    
    // Show feedback
    toast(
      isCorrect 
        ? 'Great job! You answered correctly.' 
        : `The correct answer is ${question.correct_answer}`
    );
    
  } catch (error) {
    console.error('Error updating user stats:', error);
    
    // More specific error messages
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === '42501') {
      toast.error('Permission denied. Please check your login status.');
    } else if (typeof error === 'object' && error !== null && 'message' in error && (error as any).message?.includes('JWT')) {
      toast.error('Session expired. Please log in again.');
    } else {
      toast.error('Failed to save your progress. Please try again.');
    }
  }
};

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
      <div className="flex justify-between items-center mb-6 mx-2">
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
          <CardTitle className="text-xl"><Latex>{preprocessLatex(question.question)}</Latex></CardTitle>
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