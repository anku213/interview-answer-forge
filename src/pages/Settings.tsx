import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUserApiKeys } from "@/hooks/useUserApiKeys";
import { useAuth } from "@/hooks/useAuth";
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
  Palette, 
  Globe, 
  AlertTriangle,
  Settings as SettingsIcon,
  Bot,
  Mail,
  Calendar
} from "lucide-react";
import { useDailyCron } from "@/hooks/useDailyCron";

const Settings = () => {
  const { apiKeys, loading, saveGeminiApiKey, deleteGeminiApiKey } = useUserApiKeys();
  const { user } = useAuth();
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [testingCron, setTestingCron] = useState(false);
  const { testDailyChallengeGeneration, loading: cronLoading } = useDailyCron();

  // Mock state for preferences (in real app, these would be stored in database)
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    experienceLevel: "intermediate",
    aiSuggestionsEnabled: true,
    emailNotifications: true,
    interviewReminders: true,
    newContentAlerts: false,
  });

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

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // In a real app, you would save this to the database
  };

  const handleTestDailyChallengeGeneration = async () => {
    setTestingCron(true);
    await testDailyChallengeGeneration();
    setTestingCron(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <main className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
                <SettingsIcon className="h-8 w-8 mr-3 text-primary" />
                Settings
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your account, preferences, and application settings
              </p>
            </div>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your personal account details and profile information
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium">Full Name</Label>
                    <Input 
                      placeholder="Enter your full name" 
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This will be displayed in your profile
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Email Address</Label>
                    <Input 
                      value={user?.email || ""}
                      disabled
                      className="mt-2 bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed after registration
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Profile Picture</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Button variant="outline" size="sm">Upload New Picture</Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: Square image, at least 200x200px
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Change Password</Label>
                  <div className="mt-2 space-y-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button className="w-full md:w-auto">
                      Update Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Configuration
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure AI services and manage your API keys for enhanced features
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Suggestions Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label className="text-base font-medium">AI Suggestions</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enable AI-powered hints and explanations for questions
                    </p>
                  </div>
                  <Button
                    variant={preferences.aiSuggestionsEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePreferenceChange('aiSuggestionsEnabled', !preferences.aiSuggestionsEnabled)}
                  >
                    {preferences.aiSuggestionsEnabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <Separator />

                {/* Gemini API Key */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-base font-medium">Gemini API Key</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Used for generating AI-powered solutions and explanations
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
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
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            value={showApiKey ? apiKeys.gemini_api_key : "••••••••••••••••••••••••••••••••"}
                            readOnly
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteGeminiApiKey}
                          disabled={deleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleting ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                      <p className="text-xs text-green-600">
                        ✓ Gemini API key is configured and ready to use
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="password"
                          placeholder="Enter your Gemini API key..."
                          value={geminiApiKey}
                          onChange={(e) => setGeminiApiKey(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSaveGeminiApiKey}
                          disabled={!geminiApiKey.trim() || saving}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Saving..." : "Save"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your API key will be encrypted and stored securely
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Daily Challenge Generation */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-base font-medium">Daily Challenge Generation</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automatically generate new coding challenges daily using AI
                      </p>
                    </div>
                    {apiKeys?.gemini_api_key && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestDailyChallengeGeneration}
                        disabled={testingCron}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {testingCron ? "Testing..." : "Test Generation"}
                      </Button>
                    )}
                  </div>

                  {apiKeys?.gemini_api_key ? (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                            Automatic Challenge Generation Enabled
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                            New coding challenges will be automatically generated daily using your Gemini API key. 
                            Each challenge includes problem descriptions, difficulty levels, and AI-powered hints.
                          </p>
                          <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                            <div>• Daily generation runs automatically</div>
                            <div>• Questions are stored in your database</div>
                            <div>• Uses your Gemini API key securely</div>
                            <div>• Can be tested manually using the button above</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/30 border border-border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Gemini API Key Required
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            To enable automatic daily challenge generation, please add your Gemini API key above. 
                            This will allow the system to generate new coding questions automatically.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Security & Privacy
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• API keys are stored securely and encrypted</li>
                    <li>• Only you can access your API keys</li>
                    <li>• API keys are used only for generating AI solutions</li>
                    <li>• You can delete your API keys at any time</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Preferences
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customize your application experience and interface
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium">Theme</Label>
                    <div className="mt-2 space-y-2">
                      {["light", "dark", "system"].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handlePreferenceChange('theme', theme)}
                          className={`w-full p-3 text-left rounded-lg border transition-colors ${
                            preferences.theme === theme
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <div className="font-medium capitalize">{theme}</div>
                          <div className="text-xs text-muted-foreground">
                            {theme === "system" ? "Follow system preference" : `${theme} mode`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Experience Level</Label>
                    <div className="mt-2 space-y-2">
                      {["beginner", "intermediate", "advanced"].map((level) => (
                        <button
                          key={level}
                          onClick={() => handlePreferenceChange('experienceLevel', level)}
                          className={`w-full p-3 text-left rounded-lg border transition-colors ${
                            preferences.experienceLevel === level
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <div className="font-medium capitalize">{level}</div>
                          <div className="text-xs text-muted-foreground">
                            {level === "beginner" && "New to coding interviews"}
                            {level === "intermediate" && "Some interview experience"}
                            {level === "advanced" && "Experienced developer"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Language & Region</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Control how and when you receive notifications
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <Label className="text-base font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via email
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={preferences.emailNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                    >
                      {preferences.emailNotifications ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label className="text-base font-medium">AI Interview Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Get reminded about scheduled interviews
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={preferences.interviewReminders ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('interviewReminders', !preferences.interviewReminders)}
                    >
                      {preferences.interviewReminders ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Palette className="h-5 w-5 text-green-500" />
                      <div>
                        <Label className="text-base font-medium">New Content Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Be notified about new questions and features
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={preferences.newContentAlerts ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('newContentAlerts', !preferences.newContentAlerts)}
                    >
                      {preferences.newContentAlerts ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Irreversible and destructive actions for your account
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-destructive mb-2">Reset Progress</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        This will permanently delete all your question progress, bookmarks, and AI interview history. 
                        Your account and settings will remain intact.
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
                            // Handle progress reset
                            console.log("Progress reset requested");
                          }
                        }}
                      >
                        Reset Progress
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone 
                        and you will lose access to all your questions, progress, and settings.
                      </p>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your data.")) {
                            // Handle account deletion
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
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
