
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Bot, 
  MessageSquare,
  Clock,
  Code,
  CheckCircle,
  User,
  Zap
} from "lucide-react";
import { useAIInterview, useAIInterviews } from "@/hooks/useAIInterviews";
import { useGeminiAI } from "@/hooks/useGeminiAI";
import { useInterviewContext } from "@/hooks/useInterviewContext";
import { buildInterviewPrompt, extractQuestionFromResponse } from "@/utils/interviewPromptBuilder";
import { filterAIResponse, formatInterviewResponse } from "@/utils/aiResponseFilter";
import { ChatInterface } from "@/components/ChatInterface";

const InterviewPanel = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const { interview, messages, loading, addMessage, isAddingMessage } = useAIInterview(interviewId!);
  const { updateInterview } = useAIInterviews();
  const { generateResponse, isLoading: isAILoading } = useGeminiAI();
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  
  const {
    context,
    addAskedQuestion,
    updatePhase,
    updateUserProfile,
    addToHistory,
    isQuestionAlreadyAsked,
  } = useInterviewContext();

  useEffect(() => {
    if (messages.length > 0) {
      setIsInterviewStarted(true);
      // Sync messages with interview context
      messages.forEach(msg => {
        addToHistory(msg.role, msg.content);
      });
    }
  }, [messages, addToHistory]);

  const analyzeUserResponse = (userResponse: string) => {
    // Extract potential user information from their response
    const lowerResponse = userResponse.toLowerCase();
    
    // Extract name if mentioned
    const nameMatch = userResponse.match(/(?:i'm|i am|my name is|call me)\s+([a-zA-Z]+)/i);
    if (nameMatch) {
      updateUserProfile({ name: nameMatch[1] });
    }

    // Extract experience mentions
    const experienceMatch = userResponse.match(/(\d+)\s+years?\s+(?:of\s+)?experience/i);
    if (experienceMatch) {
      updateUserProfile({ experience: `${experienceMatch[1]} years` });
    }

    // Update interview phase based on conversation flow
    if (context.interviewPhase === 'introduction' && context.conversationHistory.length >= 2) {
      updatePhase('technical');
    } else if (context.interviewPhase === 'technical' && context.conversationHistory.length >= 8) {
      updatePhase('experience');
    } else if (context.interviewPhase === 'experience' && context.conversationHistory.length >= 12) {
      updatePhase('conclusion');
    }
  };

  const handleStartInterview = async () => {
    if (!interview) return;

    await updateInterview({ 
      id: interview.id, 
      updates: { status: 'active' } 
    });

    try {
      const welcomePrompt = buildInterviewPrompt(interview, context);
      const aiResponse = await generateResponse(welcomePrompt);
      
      if (aiResponse) {
        const filteredResponse = filterAIResponse(aiResponse);
        const formattedResponse = formatInterviewResponse(filteredResponse);
        
        console.log('Starting interview with response:', formattedResponse);
        
        // Extract and track the question
        const question = extractQuestionFromResponse(formattedResponse);
        addAskedQuestion(question);
        addToHistory('assistant', formattedResponse);
        
        await addMessage({ role: 'assistant', content: formattedResponse });
      }
      
      setIsInterviewStarted(true);
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!interview) return;

    try {
      // Add user message and analyze it
      await addMessage({ role: 'user', content: userMessage });
      addToHistory('user', userMessage);
      analyzeUserResponse(userMessage);

      // Generate context-aware AI response
      const aiPrompt = buildInterviewPrompt(interview, context, userMessage);
      console.log('Generated prompt for AI:', aiPrompt);
      
      const aiResponse = await generateResponse(aiPrompt);
      
      if (aiResponse) {
        const filteredResponse = filterAIResponse(aiResponse);
        const formattedResponse = formatInterviewResponse(filteredResponse);
        
        console.log('AI response:', formattedResponse);
        
        // Extract and track the new question
        const question = extractQuestionFromResponse(formattedResponse);
        if (question && !isQuestionAlreadyAsked(question)) {
          addAskedQuestion(question);
        }
        
        addToHistory('assistant', formattedResponse);
        await addMessage({ role: 'assistant', content: formattedResponse });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCompleteInterview = async () => {
    if (!interview) return;

    await updateInterview({ 
      id: interview.id, 
      updates: { status: 'completed' } 
    });

    navigate('/ai-interview');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-muted-foreground">Loading interview...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!interview) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">Interview not found</h3>
          <Button onClick={() => navigate('/ai-interview')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interviews
          </Button>
        </div>
      </ProtectedRoute>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Enhanced Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/ai-interview')}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Interviews
                </Button>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{interview.title}</h1>
                    <div className="flex items-center space-x-3 mt-1">
                      <Badge variant="outline" className="border">
                        <Code className="h-3 w-3 mr-1" />
                        {interview.technology}
                      </Badge>
                      <Badge className={`border ${getDifficultyColor(interview.difficulty_level)}`}>
                        {interview.difficulty_level}
                      </Badge>
                      <Badge className={`border ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </Badge>
                      {context.interviewPhase && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Phase: {context.interviewPhase}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {interview.status === 'active' && (
                  <Button 
                    onClick={handleCompleteInterview} 
                    variant="outline"
                    className="border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Interview
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {!isInterviewStarted ? (
            // Enhanced Pre-interview state
            <div className="flex-1 flex items-center justify-center p-8">
              <Card className="max-w-2xl w-full shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="text-center pb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                    Ready to Begin Your Interview?
                  </CardTitle>
                  <p className="text-lg text-gray-600">
                    Your AI interviewer is ready to conduct a personalized technical interview session.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Interview Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <User className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="font-semibold text-blue-800">{interview.experience_level}</p>
                      <p className="text-sm text-blue-600">Experience Level</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <Code className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <p className="font-semibold text-purple-800">{interview.technology}</p>
                      <p className="text-sm text-purple-600">Technology Focus</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-3">What to Expect:</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Personalized questions based on your experience level
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Real-time feedback and follow-up questions
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Contextual conversation that adapts to your responses
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        Comprehensive evaluation at the end
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={handleStartInterview} 
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    size="lg"
                  >
                    <Bot className="h-5 w-5 mr-2" />
                    Start Interview Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Enhanced Chat interface
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isAddingMessage || isAILoading}
              disabled={interview.status === 'completed'}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InterviewPanel;
