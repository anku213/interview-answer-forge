
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface SmtpSettings {
  smtpEmail: string;
  smtpPassword: string;
}

export const useSmtpSettings = () => {
  const [settings, setSettings] = useState<SmtpSettings>({
    smtpEmail: "",
    smtpPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const smtpEmail = localStorage.getItem("smtpEmail") || "";
      const smtpPassword = localStorage.getItem("smtpPassword") || "";
      
      setSettings({
        smtpEmail,
        smtpPassword,
      });
    } catch (error) {
      console.error("Error loading SMTP settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = (newSettings: SmtpSettings) => {
    try {
      localStorage.setItem("smtpEmail", newSettings.smtpEmail);
      localStorage.setItem("smtpPassword", newSettings.smtpPassword);
      
      setSettings(newSettings);
      
      toast({
        title: "Settings Saved",
        description: "SMTP settings have been saved successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving SMTP settings:", error);
      toast({
        title: "Error",
        description: "Failed to save SMTP settings.",
        variant: "destructive"
      });
      return false;
    }
  };

  const clearSettings = () => {
    try {
      localStorage.removeItem("smtpEmail");
      localStorage.removeItem("smtpPassword");
      
      setSettings({
        smtpEmail: "",
        smtpPassword: "",
      });
      
      toast({
        title: "Settings Cleared",
        description: "SMTP settings have been cleared.",
      });
    } catch (error) {
      console.error("Error clearing SMTP settings:", error);
      toast({
        title: "Error",
        description: "Failed to clear SMTP settings.",
        variant: "destructive"
      });
    }
  };

  const isConfigured = settings.smtpEmail && settings.smtpPassword;

  return {
    settings,
    loading,
    saveSettings,
    clearSettings,
    isConfigured,
  };
};
