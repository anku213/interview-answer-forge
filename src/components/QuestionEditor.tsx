
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, X, Play, Sparkles, Eye, Code2, FileText, Lightbulb, Zap } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"answer" | "code">("answer");
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
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      const result = eval(code);
      console.log = originalLog;
      
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (language === "javascript") {
        const result = executeJavaScript(code);
        setOutput(result);
      } else {
        setOutput(`Code simulation for ${language}:\nCode executed successfully!\nNote: Only JavaScript execution is currently supported in the browser.`);
      }
    } catch (error) {
      setOutput(`Execution Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleGetAISolution = async () => {
    if (!title.trim()) return;

    const solution = await generateSolution({
      title,
      language,
      category,
      existingCode: code || undefined,
      existingAnswer: answer || undefined
    });

    if (solution) {
      setAnswer(solution);
    }
  };

  const handleCodeReview = async () => {
    if (!code.trim()) return;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {question ? 'Edit Question' : 'Create New Question'}
              </h1>
              <p className="text-gray-600 text-lg">
                {question ? 'Update your existing question' : 'Add a new coding question to your collection'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onCancel} className="px-6">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!title.trim()} className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Save className="h-4 w-4 mr-2" />
                Save Question
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Question Details */}
          <div className="space-y-6">
            {/* Basic Information Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Question Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-semibold text-gray-700">Question Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your interview question..."
                    className="mt-2 h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-base font-semibold text-gray-700">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-2 h-12 border-gray-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">{cat.label}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language" className="text-base font-semibold text-gray-700">Programming Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="mt-2 h-12 border-gray-200 focus:border-blue-500">
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
                </div>
              </CardContent>
            </Card>

            {/* Content Tabs */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl">
                    <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
                    Content
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={activeTab === "answer" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab("answer")}
                      className={activeTab === "answer" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Answer
                    </Button>
                    <Button
                      variant={activeTab === "code" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab("code")}
                      className={activeTab === "code" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      <Code2 className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {activeTab === "answer" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold text-gray-700">Answer & Explanation</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGetAISolution}
                        disabled={!title.trim() || aiLoading}
                        className="bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-200"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {aiLoading ? "Generating..." : "AI Solution"}
                      </Button>
                    </div>
                    <Textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Write your detailed answer and explanation here..."
                      className="min-h-[300px] resize-none border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold text-gray-700">Code Solution</Label>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleCodeReview} 
                          disabled={!code.trim() || reviewLoading}
                          variant="outline"
                          size="sm"
                          className="bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {reviewLoading ? "Reviewing..." : "AI Review"}
                        </Button>
                        <Button 
                          onClick={handleRunCode} 
                          disabled={!code.trim() || isRunning}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isRunning ? "Running..." : "Run Code"}
                        </Button>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <CodeEditor
                        value={code}
                        onChange={setCode}
                        language={language}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Output & Reviews */}
          <div className="space-y-6">
            {/* Code Output */}
            {output && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="flex items-center text-xl">
                    <Zap className="h-5 w-5 mr-2 text-blue-600" />
                    Code Output
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Code Review */}
            {codeReview && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                  <CardTitle className="flex items-center text-xl">
                    <Eye className="h-5 w-5 mr-2 text-orange-600" />
                    AI Code Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {codeReview}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-indigo-800">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm text-indigo-700">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Use clear, descriptive titles that explain the problem</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Include time and space complexity analysis in your answer</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Test your code with different inputs before saving</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Use AI assistance to generate solutions and reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
