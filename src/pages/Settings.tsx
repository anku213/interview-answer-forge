import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUserApiKeys } from "@/hooks/useUserApiKeys";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CronJobManager } from "@/components/CronJobManager";
import { useManualQuestionGeneration } from "@/hooks/useManualQuestionGeneration";
import { 
  Key, 
  Eye, 
  EyeOff, 
  Trash2, 
  Save, 
  ExternalLink, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  AlertTriangle,
  Settings as SettingsIcon,
  Bot,
  Mail,
  Calendar,
  Check,
  X,
  Edit,
  Camera,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Zap,
  Clock,
  Play
} from "lucide-react";
import { useDailyCron } from "@/hooks/useDailyCron";

const Settings = () => {
  const { apiKeys, loading, saveGeminiApiKey, deleteGeminiApiKey } = useUserApiKeys();
  const { user } = useAuth();
  const { toast } = useToast();
  const { generateQuestions, loading: generatingQuestions } = useManualQuestionGeneration();
  
  // Form states
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [testingCron, setTestingCron] = useState(false);
  
  // Manual generation form states
  const [questionCount, setQuestionCount] = useState(5);
  const [questionDifficulty, setQuestionDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  
  // Profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileUpdating, setProfileUpdating] = useState(false);
  
  // Password states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [newContentAlerts, setNewContentAlerts] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  
  // Theme states
  const [selectedTheme, setSelectedTheme] = useState("system");
  
  const { testDailyChallengeGeneration, loading: cronLoading } = useDailyCron();

  useEffect(() => {
    // Initialize profile data from user metadata
    if (user?.user_metadata) {
      setFirstName(user.user_metadata.first_name || "");
      setLastName(user.user_metadata.last_name || "");
    }
  }, [user]);

  const handleSaveGeminiApiKey = async () => {
    if (!geminiApiKey.trim()) return;
    
    setSaving(true);
    await saveGeminiApiKey(geminiApiKey.trim());
    setGeminiApiKey("");
    setSaving(false);
  };

  const handleDeleteGeminiApiKey = async () => {
    if (!confirm("Are you sure you want to delete your Gemini API key?")) return;
    
    setDeleting(true);
    await deleteGeminiApiKey();
    setDeleting(false);
  };

  const handleManualQuestionGeneration = async () => {
    if (!apiKeys?.gemini_api_key) {
      toast({
        title: "API Key Required",
        description: "Please configure your Gemini API key first",
        variant: "destructive"
      });
      return;
    }

    await generateQuestions({
      count: questionCount,
      difficulty: questionDifficulty
    });
  };

  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both first and last name",
        variant: "destructive"
      });
      return;
    }

    setProfileUpdating(true);
    
    try {
      // Simulate API call - in real app, this would update user metadata
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditingProfile(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setPasswordUpdating(true);
    
    try {
      // Simulate API call - in real app, this would call Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Password updated successfully"
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleNotificationToggle = async (type: string, value: boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      switch (type) {
        case 'email':
          setEmailNotifications(value);
          break;
        case 'reminders':
          setInterviewReminders(value);
          break;
        case 'content':
          setNewContentAlerts(value);
          break;
        case 'push':
          setPushNotifications(value);
          break;
      }
      
      toast({
        title: "Updated",
        description: `Notification preferences saved`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive"
      });
    }
  };

  const handleThemeChange = async (theme: string) => {
    try {
      setSelectedTheme(theme);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast({
        title: "Updated",
        description: `Theme changed to ${theme}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme",
        variant: "destructive"
      });
    }
  };

  const handleTestDailyChallengeGeneration = async () => {
    setTestingCron(true);
    await testDailyChallengeGeneration();
    setTestingCron(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">Loading settings...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
                  <SettingsIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Settings</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Manage your account, preferences, and application settings to customize your experience
              </p>
            </div>

            {/* Account Information */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <User className="h-6 w-6 text-blue-600" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 bg-white border-2 border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">Profile Picture</h3>
                    <p className="text-gray-600 mb-3">Update your profile image</p>
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload New Picture
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                      <p className="text-gray-600">Your basic profile details</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditingProfile ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  {isEditingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div>
                        <Label className="text-base font-medium text-gray-700">First Name</Label>
                        <Input 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter your first name" 
                          className="mt-2 h-12 border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium text-gray-700">Last Name</Label>
                        <Input 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter your last name" 
                          className="mt-2 h-12 border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-base font-medium text-gray-700">Email Address</Label>
                        <Input 
                          value={user?.email || ""}
                          disabled
                          className="mt-2 h-12 bg-gray-100 border-gray-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed after registration</p>
                      </div>
                      <div className="md:col-span-2 flex space-x-3">
                        <Button 
                          onClick={handleUpdateProfile}
                          disabled={profileUpdating}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {profileUpdating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditingProfile(false)}
                          className="border-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-sm font-medium text-gray-500">First Name</Label>
                        <p className="text-lg font-medium text-gray-800 mt-1">{firstName || "Not set"}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-sm font-medium text-gray-500">Last Name</Label>
                        <p className="text-lg font-medium text-gray-800 mt-1">{lastName || "Not set"}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                        <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                        <p className="text-lg font-medium text-gray-800 mt-1">{user?.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Password Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Password & Security</h3>
                      <p className="text-gray-600">Manage your account security</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {isChangingPassword ? 'Cancel' : 'Change Password'}
                    </Button>
                  </div>

                  {isChangingPassword && (
                    <div className="space-y-4 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div>
                        <Label className="text-base font-medium text-gray-700">Current Password</Label>
                        <Input 
                          type="password" 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password" 
                          className="mt-2 h-12 border-yellow-200 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium text-gray-700">New Password</Label>
                        <Input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password" 
                          className="mt-2 h-12 border-yellow-200 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium text-gray-700">Confirm New Password</Label>
                        <Input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password" 
                          className="mt-2 h-12 border-yellow-200 focus:border-yellow-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleChangePassword}
                          disabled={passwordUpdating}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          {passwordUpdating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Update Password
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsChangingPassword(false)}
                          className="border-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Configuration */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Bot className="h-6 w-6 text-purple-600" />
                  AI Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Gemini API Key */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Gemini API Key</h3>
                      <p className="text-gray-600">Used for generating AI-powered solutions and explanations</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Get API Key
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>

                  {apiKeys?.gemini_api_key ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            value={showApiKey ? apiKeys.gemini_api_key : "••••••••••••••••••••••••••••••••"}
                            readOnly
                            className="pr-12 h-12 bg-green-50 border-green-200"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteGeminiApiKey}
                          disabled={deleting}
                          className="h-12 px-6"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleting ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">Gemini API key is configured and ready to use</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Input
                          type="password"
                          placeholder="Enter your Gemini API key..."
                          value={geminiApiKey}
                          onChange={(e) => setGeminiApiKey(e.target.value)}
                          className="flex-1 h-12 border-gray-200 focus:border-purple-500"
                        />
                        <Button
                          onClick={handleSaveGeminiApiKey}
                          disabled={!geminiApiKey.trim() || saving}
                          className="h-12 px-6 bg-purple-600 hover:bg-purple-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Saving..." : "Save"}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Your API key will be encrypted and stored securely
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Manual Question Generation */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Manual Question Generation</h3>
                      <p className="text-gray-600">Generate company interview questions instantly with AI</p>
                    </div>
                  </div>

                  {apiKeys?.gemini_api_key ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <Zap className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-900 mb-2">
                              Generate Questions Instantly
                            </h4>
                            <p className="text-green-700 mb-4">
                              Use AI to generate new interview questions for top tech companies. 
                              Customize the number of questions and difficulty level.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Number of Questions</Label>
                            <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                              <SelectTrigger className="h-10 border-green-200 focus:border-green-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3">3 Questions</SelectItem>
                                <SelectItem value="5">5 Questions</SelectItem>
                                <SelectItem value="10">10 Questions</SelectItem>
                                <SelectItem value="15">15 Questions</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty Level</Label>
                            <Select value={questionDifficulty} onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setQuestionDifficulty(value)}>
                              <SelectTrigger className="h-10 border-green-200 focus:border-green-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-end">
                            <Button
                              onClick={handleManualQuestionGeneration}
                              disabled={generatingQuestions}
                              className="w-full h-10 bg-green-600 hover:bg-green-700 text-white"
                            >
                              {generatingQuestions ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Generate Now
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Instant generation
                          </div>
                          <div className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Multiple difficulty levels
                          </div>
                          <div className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            AI-powered hints
                          </div>
                          <div className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Auto-saved to database
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-200 p-3 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Gemini API Key Required
                          </h4>
                          <p className="text-gray-600">
                            To enable manual question generation, please add your Gemini API key above. 
                            This will allow you to generate interview questions instantly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Daily Challenge Generation */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Daily Challenge Generation</h3>
                      <p className="text-gray-600">Automatically generate new coding challenges daily using AI</p>
                    </div>
                    {apiKeys?.gemini_api_key && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestDailyChallengeGeneration}
                        disabled={testingCron}
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {testingCron ? "Testing..." : "Test Generation"}
                      </Button>
                    )}
                  </div>

                  {apiKeys?.gemini_api_key ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">
                            Automatic Challenge Generation Enabled
                          </h4>
                          <p className="text-blue-700 mb-4">
                            New coding challenges will be automatically generated daily using your Gemini API key. 
                            Each challenge includes problem descriptions, difficulty levels, and AI-powered hints.
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-blue-600">
                              <Check className="h-4 w-4 mr-2" />
                              Daily generation runs automatically
                            </div>
                            <div className="flex items-center text-blue-600">
                              <Check className="h-4 w-4 mr-2" />
                              Questions stored in your database
                            </div>
                            <div className="flex items-center text-blue-600">
                              <Check className="h-4 w-4 mr-2" />
                              Uses your Gemini API key securely
                            </div>
                            <div className="flex items-center text-blue-600">
                              <Check className="h-4 w-4 mr-2" />
                              Can be tested manually
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-200 p-3 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Gemini API Key Required
                          </h4>
                          <p className="text-gray-600">
                            To enable automatic daily challenge generation, please add your Gemini API key above. 
                            This will allow the system to generate new coding questions automatically.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Automated Question Generation */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Clock className="h-6 w-6 text-green-600" />
                  Automated Question Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <CronJobManager />
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Bell className="h-6 w-6 text-green-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid gap-6">
                  {[
                    {
                      icon: Mail,
                      title: "Email Notifications",
                      description: "Receive important updates via email",
                      value: emailNotifications,
                      onChange: (value: boolean) => handleNotificationToggle('email', value),
                      color: "text-blue-500"
                    },
                    {
                      icon: Bell,
                      title: "Interview Reminders",
                      description: "Get reminded about scheduled interviews",
                      value: interviewReminders,
                      onChange: (value: boolean) => handleNotificationToggle('reminders', value),
                      color: "text-purple-500"
                    },
                    {
                      icon: Zap,
                      title: "New Content Alerts",
                      description: "Be notified about new questions and features",
                      value: newContentAlerts,
                      onChange: (value: boolean) => handleNotificationToggle('content', value),
                      color: "text-orange-500"
                    },
                    {
                      icon: Smartphone,
                      title: "Push Notifications",
                      description: "Receive notifications on your device",
                      value: pushNotifications,
                      onChange: (value: boolean) => handleNotificationToggle('push', value),
                      color: "text-green-500"
                    }
                  ].map((notification, index) => (
                    <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <notification.icon className={`h-6 w-6 ${notification.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                          <p className="text-gray-600">{notification.description}</p>
                        </div>
                      </div>
                      <Button
                        variant={notification.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => notification.onChange(!notification.value)}
                        className={notification.value ? "bg-green-600 hover:bg-green-700" : "border-gray-300"}
                      >
                        {notification.value ? (
                          <><Check className="h-4 w-4 mr-2" />On</>
                        ) : (
                          <><X className="h-4 w-4 mr-2" />Off</>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Theme Selection */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Monitor className="h-6 w-6 text-indigo-600" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Theme Selection</h3>
                    <p className="text-gray-600 mb-6">Choose your preferred theme</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        value: "light",
                        label: "Light",
                        description: "Clean and bright interface",
                        icon: Sun
                      },
                      {
                        value: "dark",
                        label: "Dark",
                        description: "Easy on the eyes",
                        icon: Moon
                      },
                      {
                        value: "system",
                        label: "System",
                        description: "Follow system preference",
                        icon: Monitor
                      }
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        className={`p-6 text-left rounded-xl border-2 transition-all ${
                          selectedTheme === theme.value
                            ? "border-indigo-500 bg-indigo-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <theme.icon className={`h-6 w-6 ${selectedTheme === theme.value ? 'text-indigo-600' : 'text-gray-500'}`} />
                          {selectedTheme === theme.value && (
                            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                              Active
                            </Badge>
                          )}
                        </div>
                        <div className="font-semibold text-gray-800 mb-1">{theme.label}</div>
                        <div className="text-sm text-gray-600">{theme.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-red-200">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200">
                <CardTitle className="flex items-center gap-3 text-2xl text-red-700">
                  <AlertTriangle className="h-6 w-6" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800 mb-2">Reset Progress</h4>
                      <p className="text-red-700 mb-4">
                        This will permanently delete all your question progress, bookmarks, and AI interview history. 
                        Your account and settings will remain intact.
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
                            console.log("Progress reset requested");
                          }
                        }}
                      >
                        Reset Progress
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                      <p className="text-red-700 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone 
                        and you will lose access to all your questions, progress, and settings.
                      </p>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your data.")) {
                            console.log("Account deletion requested");
                          }
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
