
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Play, Sparkles, Eye } from "lucide-react";
import { Question } from "@/types/Question";
import { CodeEditor } from "./CodeEditor";
import { CATEGORIES } from "@/utils/categories";
import { useGeminiAI } from "@/hooks/useGeminiAI";

interface QuestionEditorProps {
  question?: Question;
  onSave: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  onCancel: () => void;
}

export const QuestionEditor = ({ question, onSave, onCancel }: QuestionEditorProps) => {
  const [title, setTitle] = useState(question?.title || "");
  const [answer, setAnswer] = useState(question?.answer || "");
  const [code, setCode] = useState(question?.code || "");
  const [language, setLanguage] = useState(question?.language || "javascript");
  const [category, setCategory] = useState(question?.category || "javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [codeReview, setCodeReview] = useState("");
  const { generateSolution, reviewCode, loading: aiLoading, reviewLoading } = useGeminiAI();

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      answer: answer.trim(),
      code: code.trim(),
      language,
      category
    });
  };

  const executeJavaScript = (code: string) => {
    try {
      // Capture console.log output
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // Execute the code
      const result = eval(code);
      
      // Restore original console.log
      console.log = originalLog;
      
      // Return logs or result
      if (logs.length > 0) {
        return logs.join('\n');
      } else if (result !== undefined) {
        return typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
      } else {
        return 'Code executed successfully (no output)';
      }
    } catch (error) {
      console.log = console.log;
      return `Error: ${error.message}`;
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setOutput("");
    
    try {
      // Add a small delay to show the running state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (language === "javascript") {
        const result = executeJavaScript(code);
        setOutput(result);
      } else {
        // For other languages, show a simulation message
        setOutput(`Code simulation for ${language}:\nCode executed successfully!\nNote: Only JavaScript execution is currently supported in the browser.`);
      }
    } catch (error) {
      setOutput(`Execution Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleGetAISolution = async () => {
    if (!title.trim()) {
      return;
    }

    const solution = await generateSolution({
      title,
      language,
      category,
      existingCode: code || undefined,
      existingAnswer: answer || undefined
    });

    if (solution) {
      // Parse the AI solution and update the answer field
      setAnswer(solution);
    }
  };

  const handleCodeReview = async () => {
    if (!code.trim()) {
      return;
    }

    const review = await reviewCode({
      code,
      language,
      title: title || undefined,
      category: category || undefined
    });

    if (review) {
      setCodeReview(review);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your interview question..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Programming Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="answer">Answer</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetAISolution}
                disabled={!title.trim() || aiLoading}
                className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border-purple-200"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {aiLoading ? "Generating..." : "Get AI Solution"}
              </Button>
            </div>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your detailed answer here..."
              className="mt-1 min-h-[200px] resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!title.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save Question
            </Button>
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Code Solution</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={handleCodeReview} 
                disabled={!code.trim() || reviewLoading}
                variant="outline"
                className="bg-gradient-to-r from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 border-orange-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                {reviewLoading ? "Reviewing..." : "AI Code Review"}
              </Button>
              <Button 
                onClick={handleRunCode} 
                disabled={!code.trim() || isRunning}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Code Editor</Label>
            <div className="mt-1">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            </div>
          </div>
          
          {output && (
            <div>
              <Label>Output</Label>
              <div className="mt-1 p-3 bg-gray-100 rounded border border-gray-300 min-h-[100px]">
                <pre className="text-sm text-black font-mono whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>
          )}

          {codeReview && (
            <div>
              <Label>AI Code Review</Label>
              <div className="mt-1 p-4 bg-orange-50 rounded border border-orange-200 max-h-[400px] overflow-y-auto">
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {codeReview}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
