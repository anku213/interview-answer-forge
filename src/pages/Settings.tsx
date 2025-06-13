
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { useUserApiKeys } from "@/hooks/useUserApiKeys";
import { Key, Eye, EyeOff, Trash2, Save, ExternalLink } from "lucide-react";

const Settings = () => {
  const { apiKeys, loading, saveGeminiApiKey, deleteGeminiApiKey } = useUserApiKeys();
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        <Header
          onNewQuestion={() => {}}
          searchTerm=""
          onSearchChange={() => {}}
        />
        
        <main className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground text-lg">
                Manage your API keys and preferences
              </p>
            </div>

            {/* API Keys Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your API keys for AI-powered features
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
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
                        ✓ Gemini API key is configured
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

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">About API Keys</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• API keys are stored securely and encrypted</li>
                    <li>• Only you can access your API keys</li>
                    <li>• API keys are used only for generating AI solutions</li>
                    <li>• You can delete your API keys at any time</li>
                  </ul>
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
