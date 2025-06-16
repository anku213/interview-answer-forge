
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  MessageSquare,
  Clock,
  Code,
  CheckCircle
} from "lucide-react";
import { useAIInterview, useAIInterviews } from "@/hooks/useAIInterviews";
import { useGeminiAI } from "@/hooks/useGeminiAI";

const InterviewPanel = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const { interview, messages, loading, addMessage, isAddingMessage } = useAIInterview(interviewId!);
  const { updateInterview } = useAIInterviews();
  const { generateResponse, isLoading: isAILoading } = useGeminiAI();
  const [message, setMessage] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setIsInterviewStarted(true);
    }
  }, [messages]);

  const handleStartInterview = async () => {
    if (!interview) return;

    // Update interview status to active
    await updateInterview({ 
      id: interview.id, 
      updates: { status: 'active' } 
    });

    // Generate AI welcome message
    const welcomePrompt = `You are an AI technical interviewer conducting a ${interview.difficulty_level} level interview for a ${interview.experience_level} position focusing on ${interview.technology}. 

Interview Details:
- Title: ${interview.title}
- Technology: ${interview.technology}
- Experience Level: ${interview.experience_level}
- Difficulty: ${interview.difficulty_level}

Start the interview with a warm welcome, briefly explain the interview process, and ask the first technical question appropriate for this level and technology. Keep your response professional but friendly.`;

    try {
      const aiResponse = await generateResponse(welcomePrompt);
      await addMessage({ role: 'assistant', content: aiResponse });
      setIsInterviewStarted(true);
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !interview) return;

    const userMessage = message.trim();
    setMessage("");

    try {
      // Add user message
      await addMessage({ role: 'user', content: userMessage });

      // Generate AI response
      const conversationHistory = messages.map(msg => 
        `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`
      ).join('\n\n');

      const aiPrompt = `You are conducting a technical interview for a ${interview.experience_level} ${interview.technology} position. 

Interview Context:
- Title: ${interview.title}
- Technology: ${interview.technology}
- Experience Level: ${interview.experience_level}
- Difficulty: ${interview.difficulty_level}

Previous conversation:
${conversationHistory}

Candidate: ${userMessage}

As the interviewer, respond appropriately. Ask follow-up questions, provide feedback, or move to the next topic as needed. Keep responses concise and professional. If the candidate seems to be struggling, provide gentle guidance. If they're doing well, you can increase the difficulty slightly.`;

      const aiResponse = await generateResponse(aiPrompt);
      await addMessage({ role: 'assistant', content: aiResponse });
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/ai-interview')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold">{interview.title}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">
                    <Code className="h-3 w-3 mr-1" />
                    {interview.technology}
                  </Badge>
                  <Badge className={getDifficultyColor(interview.difficulty_level)}>
                    {interview.difficulty_level}
                  </Badge>
                  <Badge className={getStatusColor(interview.status)}>
                    {interview.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {interview.status === 'active' && (
                <Button onClick={handleCompleteInterview} variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Interview
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Interview Content */}
        <div className="flex-1 flex flex-col max-h-[calc(100vh-120px)]">
          {!isInterviewStarted ? (
            // Pre-interview state
            <div className="flex-1 flex items-center justify-center p-8">
              <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <MessageSquare className="h-6 w-6" />
                    <span>Ready to Start?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Position:</strong> {interview.experience_level}</p>
                    <p><strong>Technology:</strong> {interview.technology}</p>
                    <p><strong>Difficulty:</strong> {interview.difficulty_level}</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Click the button below to begin your AI-powered technical interview. 
                    The AI interviewer will ask you questions relevant to your experience level and chosen technology.
                  </p>
                  
                  <Button onClick={handleStartInterview} className="w-full">
                    <Bot className="h-4 w-4 mr-2" />
                    Start Interview
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Chat interface
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.role === 'assistant' && (
                            <Bot className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          )}
                          {msg.role === 'user' && (
                            <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-2">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(isAddingMessage || isAILoading) && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-5 w-5" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="max-w-4xl mx-auto flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your response..."
                    disabled={isAddingMessage || isAILoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isAddingMessage || isAILoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InterviewPanel;
