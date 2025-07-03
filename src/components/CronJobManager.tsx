import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Plus, 
  Settings, 
  Trash2, 
  Clock, 
  Play, 
  Pause,
  AlertCircle
} from "lucide-react";
import { useCronConfigurations } from "@/hooks/useCronConfigurations";
import { useCompanies } from "@/hooks/useCompanies";

export const CronJobManager = () => {
  const { configurations, loading, createConfiguration, updateConfiguration, deleteConfiguration } = useCronConfigurations();
  const { companies } = useCompanies();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    job_name: "",
    schedule: "0 0 * * *", // Daily at midnight
    selectedCompanies: [] as string[],
    questionsPerRun: 5,
    difficulty: "Medium"
  });

  const scheduleOptions = [
    { value: "0 0 * * *", label: "Daily at Midnight" },
    { value: "0 12 * * *", label: "Daily at Noon" },
    { value: "0 0 * * 1", label: "Weekly (Mondays)" },
    { value: "0 0 1 * *", label: "Monthly (1st of month)" },
    { value: "*/30 * * * *", label: "Every 30 minutes" }
  ];

  const handleCreateJob = async () => {
    if (!formData.job_name.trim()) return;

    const success = await createConfiguration({
      job_name: formData.job_name,
      schedule: formData.schedule,
      configuration: {
        companies: formData.selectedCompanies,
        questionsPerRun: formData.questionsPerRun,
        difficulty: formData.difficulty,
        jobType: "company_questions_generation"
      }
    });

    if (success) {
      setShowCreateForm(false);
      setFormData({
        job_name: "",
        schedule: "0 0 * * *",
        selectedCompanies: [],
        questionsPerRun: 5,
        difficulty: "Medium"
      });
    }
  };

  const toggleJobStatus = async (id: string, currentStatus: boolean) => {
    await updateConfiguration(id, { is_active: !currentStatus });
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm("Are you sure you want to delete this cron job?")) {
      await deleteConfiguration(id);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500/30 border-t-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Automated Question Generation</h3>
          <p className="text-gray-600">Schedule automatic generation of company interview questions</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Cron Job
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Create New Cron Job
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-base font-medium">Job Name</Label>
              <Input
                value={formData.job_name}
                onChange={(e) => setFormData({ ...formData, job_name: e.target.value })}
                placeholder="e.g., Daily FAANG Questions"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-base font-medium">Schedule</Label>
              <Select value={formData.schedule} onValueChange={(value) => setFormData({ ...formData, schedule: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scheduleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium">Questions per Run</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.questionsPerRun}
                  onChange={(e) => setFormData({ ...formData, questionsPerRun: parseInt(e.target.value) || 5 })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-base font-medium">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleCreateJob} className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Create Job
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Jobs */}
      {configurations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Cron Jobs Yet</h3>
            <p className="text-gray-500 mb-4">Create your first automated question generation job to get started.</p>
            <Button onClick={() => setShowCreateForm(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {configurations.map((config) => (
            <Card key={config.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{config.job_name}</h4>
                      <Badge variant={config.is_active ? "default" : "secondary"} className="flex items-center gap-1">
                        {config.is_active ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                        {config.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{scheduleOptions.find(s => s.value === config.schedule)?.label || config.schedule}</span>
                      </div>
                      <div>
                        <span className="font-medium">Questions:</span> {config.configuration?.questionsPerRun || 5}
                      </div>
                      <div>
                        <span className="font-medium">Difficulty:</span> {config.configuration?.difficulty || "Medium"}
                      </div>
                      <div>
                        <span className="font-medium">Last run:</span> {
                          config.last_run_at 
                            ? new Date(config.last_run_at).toLocaleDateString()
                            : "Never"
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Switch
                      checked={config.is_active}
                      onCheckedChange={() => toggleJobStatus(config.id, config.is_active)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteJob(config.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Section */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Cron jobs require your Gemini API key to be configured</li>
                <li>• Generated questions will be added to the company questions database</li>
                <li>• Jobs run automatically based on the schedule you set</li>
                <li>• You can pause/resume jobs at any time using the toggle switch</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
