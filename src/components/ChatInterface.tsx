
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Mic, MicOff, Volume2, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { InterviewMessage } from "@/hooks/useAIInterviews";

interface ChatInterfaceProps {
  messages: InterviewMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInterface = ({ messages, onSendMessage, isLoading, disabled }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || isLoading || disabled) return;
    
    onSendMessage(message.trim());
    setMessage("");
    
    // Focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to begin your interview?</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                I'm your AI interviewer. I'll ask you technical questions and provide feedback on your answers. 
                Let's start when you're ready!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <Avatar className={`flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-blue-600'}`}>
                    <AvatarFallback className="text-white font-semibold">
                      {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>

                  {/* Message Bubble */}
                  <div className={`group relative ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <Card className={`shadow-lg border-0 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user' ? 'text-white' : 'text-gray-800'
                          }`}>
                            {msg.content}
                          </p>
                          
                          {/* Timestamp */}
                          <div className={`flex items-center gap-2 text-xs ${
                            msg.role === 'user' ? 'text-blue-100 justify-end' : 'text-gray-500 justify-start'
                          }`}>
                            <span>{formatTime(msg.created_at)}</span>
                            {msg.role === 'assistant' && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(msg.content)}
                                  className="h-6 w-6 p-0 hover:bg-gray-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-gray-100"
                                >
                                  <Volume2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Feedback buttons for AI messages */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex items-start space-x-3 max-w-[85%]">
                <Avatar className="bg-gradient-to-br from-purple-500 to-blue-600 flex-shrink-0">
                  <AvatarFallback className="text-white font-semibold">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-white border border-gray-200 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">AI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area - Sticky */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response here..."
                disabled={isLoading || disabled}
                className="pr-20 py-3 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 rounded-xl resize-none min-h-[48px]"
                style={{ paddingRight: '80px' }}
              />
              
              {/* Voice Recording Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
                className={`absolute right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                  isRecording ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600'
                }`}
                disabled={isLoading || disabled}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Send Button */}
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading || disabled}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg px-6 py-3 rounded-xl"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Helper text */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{message.length}/500</span>
          </div>
        </div>
      </div>
    </div>
  );
};
