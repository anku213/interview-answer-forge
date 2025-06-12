
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Play } from "lucide-react";
import { Question } from "@/types/Question";
import { CodeEditor } from "./CodeEditor";

interface QuestionEditorProps {
  question?: Question;
  onSave: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const QuestionEditor = ({ question, onSave, onCancel }: QuestionEditorProps) => {
  const [title, setTitle] = useState(question?.title || "");
  const [answer, setAnswer] = useState(question?.answer || "");
  const [code, setCode] = useState(question?.code || "");
  const [language, setLanguage] = useState(question?.language || "javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      answer: answer.trim(),
      code: code.trim(),
      language
    });
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    try {
      // Simulate code execution for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (language === "javascript") {
        try {
          const result = eval(code);
          setOutput(String(result));
        } catch (error) {
          setOutput(`Error: ${error.message}`);
        }
      } else {
        setOutput(`Code executed successfully in ${language}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
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
            <Label htmlFor="answer">Answer</Label>
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
            <Button 
              onClick={handleRunCode} 
              disabled={!code.trim() || isRunning}
              className="animate-code-run"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
          />
          
          {output && (
            <div>
              <Label>Output</Label>
              <div className="mt-1 p-3 bg-editor rounded border border-editor-border">
                <pre className="text-sm text-editor-foreground font-mono whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
