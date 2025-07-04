
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserApiKeys } from "@/hooks/useUserApiKeys";
import { Eye, EyeOff, Trash2, Save, User, Key, Mail } from "lucide-react";
import SmtpSettings from "@/components/SmtpSettings";

const Settings = () => {
  const { apiKeys, loading, saveGeminiApiKey, deleteGeminiApiKey } = useUserApiKeys();
  const [geminiKey, setGeminiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (apiKeys?.gemini_api_key) {
      setGeminiKey(apiKeys.gemini_api_key);
    }
  }, [apiKeys]);

  const handleSaveGeminiKey = async () => {
    if (!geminiKey.trim()) return;
    
    setIsSaving(true);
    await saveGeminiApiKey(geminiKey);
    setIsSaving(false);
  };

  const handleDeleteGeminiKey = async () => {
    setIsSaving(true);
    await deleteGeminiApiKey();
    setGeminiKey("");
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage your API keys and application settings</p>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="email-settings" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Gemini API Key
              </CardTitle>
              <CardDescription>
                Configure your Google Gemini API key for AI-powered features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gemini-key">API Key</Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Input
                      id="gemini-key"
                      type={showKey ? "text" : "password"}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    onClick={handleSaveGeminiKey}
                    disabled={!geminiKey.trim() || isSaving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  {apiKeys?.gemini_api_key && (
                    <Button
                      variant="destructive"
                      onClick={handleDeleteGeminiKey}
                      disabled={isSaving}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {apiKeys?.gemini_api_key && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  ✓ Gemini API key is configured and ready to use
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-settings" className="space-y-6">
          <SmtpSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
