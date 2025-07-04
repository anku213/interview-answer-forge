
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Shield, Key, ExternalLink, AlertTriangle } from "lucide-react";
import { useSmtpSettings } from "@/hooks/useSmtpSettings";

const SmtpSettings = () => {
  const { settings, saveSettings, clearSettings, isConfigured } = useSmtpSettings();
  const [formData, setFormData] = useState(settings);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.smtpEmail || !formData.smtpPassword) {
      return;
    }

    setIsSaving(true);
    const success = saveSettings(formData);
    setIsSaving(false);
  };

  const handleClear = () => {
    clearSettings();
    setFormData({
      smtpEmail: "",
      smtpPassword: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6" />
            <div>
              <CardTitle>Gmail SMTP Configuration</CardTitle>
              <CardDescription className="text-blue-100">
                Configure your Gmail credentials to enable email sending
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">SMTP Credentials</h3>
              
              <div>
                <Label htmlFor="smtpEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Gmail Email Address
                </Label>
                <Input
                  id="smtpEmail"
                  name="smtpEmail"
                  type="email"
                  value={formData.smtpEmail}
                  onChange={handleInputChange}
                  placeholder="your-email@gmail.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="smtpPassword" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Gmail App Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="smtpPassword"
                    name="smtpPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.smtpPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your 16-character app password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={!formData.smtpEmail || !formData.smtpPassword || isSaving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
                
                {isConfigured && (
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Clear Settings
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Setup Instructions</h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Important Security Note</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Never use your regular Gmail password. Always use an App Password for security.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Enable 2-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">
                      Go to your Google Account settings and enable 2-factor authentication if not already enabled.
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600"
                      asChild
                    >
                      <a
                        href="https://myaccount.google.com/security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Open Google Security Settings
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Generate App Password</h4>
                    <p className="text-sm text-gray-600">
                      In your Google Account, go to Security → App passwords → Generate new password for "Mail".
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-green-600"
                      asChild
                    >
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Generate App Password
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Copy and Save</h4>
                    <p className="text-sm text-gray-600">
                      Copy the 16-character app password and paste it in the form above. Save your settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  What you need to know:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Your Gmail address must end with @gmail.com
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    App passwords are 16 characters without spaces
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    2-Factor Authentication must be enabled
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Credentials are stored locally in your browser
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Data is encrypted and secure
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    No regular passwords accepted
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmtpSettings;
