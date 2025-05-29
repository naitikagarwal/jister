import { Rocket, BookOpen, BarChart2, Users, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Master IIT JEE with <span className="text-yellow-500">Jister</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            The ultimate platform for IIT JEE aspirants to practice, analyze, and excel in their preparation.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer" onClick={() => window.location.href = '/problemset'}>
              Start Practicing
              <Rocket className="ml-2 h-4 w-4" />
            </Button>
            {/* <Button size="lg" variant="outline">
              Explore Features
            </Button> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Jister?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-yellow-600 mb-4" />
              <CardTitle>Comprehensive Question Bank</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                10,000+ carefully curated questions covering all JEE topics with detailed solutions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart2 className="h-8 w-8 text-yellow-600 mb-4" />
              <CardTitle>Smart Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your progress with personalized analytics and identify weak areas.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-yellow-600 mb-4" />
              <CardTitle>Competitive Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Compare your performance with thousands of JEE aspirants nationwide.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-yellow-600 mb-4" />
              <CardTitle>Previous Year Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Full collection of past 15 years JEE papers with timed test environment.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-yellow-600 mb-4" />
              <CardTitle>Conceptual Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Video solutions and concept notes for every question to strengthen fundamentals.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to boost your JEE preparation?</h2>
          <p className="text-lg mb-8">
            Join thousands of IIT JEE aspirants who are improving their rank with Jister.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white text-gray-900"
              />
              <Button className="bg-white text-yellow-600 hover:bg-yellow-50">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <blockquote className="space-y-4">
                <p className="text-gray-600">
                  "Jister's question bank helped me identify my weak areas in Physics. The detailed solutions are a game-changer!"
                </p>
                <footer className="text-sm font-medium text-gray-900">
                  — Rahul Sharma, JEE Advanced 2023 (AIR 147)
                </footer>
              </blockquote>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <blockquote className="space-y-4">
                <p className="text-gray-600">
                  "The timed tests on Jister prepared me for the actual exam pressure. I could complete my paper 15 minutes early!"
                </p>
                <footer className="text-sm font-medium text-gray-900">
                  — Priya Patel, JEE Mains 2023 (99.8 percentile)
                </footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}