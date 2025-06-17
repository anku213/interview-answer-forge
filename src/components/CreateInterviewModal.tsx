import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    technology: string;
    experience_level: string;
    difficulty_level: string;
  }) => void;
}

export const CreateInterviewModal = ({ open, onOpenChange, onSubmit }: CreateInterviewModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    technology: "",
    experience_level: "",
    difficulty_level: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.technology || !formData.experience_level || !formData.difficulty_level) {
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      title: "",
      technology: "",
      experience_level: "",
      difficulty_level: "",
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form on close
    setFormData({
      title: "",
      technology: "",
      experience_level: "",
      difficulty_level: "",
    });
  };

  const technologies = [
    // Frontend Technologies
    "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Svelte", "Next.js", "Nuxt.js",
    "HTML/CSS", "Sass/SCSS", "Tailwind CSS", "Bootstrap", "jQuery", "Webpack", "Vite",
    
    // Backend Technologies
    "Node.js", "Express.js", "Nest.js", "Python", "Django", "Flask", "FastAPI", "Java", 
    "Spring Boot", "C#", "ASP.NET", "Go", "Gin", "Rust", "PHP", "Laravel", "Symfony", 
    "Ruby", "Ruby on Rails", "Kotlin", "Swift",
    
    // Databases
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "MariaDB", "Oracle Database", 
    "SQL Server", "DynamoDB", "Cassandra", "Neo4j", "InfluxDB", "Elasticsearch",
    
    // Cloud & DevOps
    "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Jenkins", "GitLab CI", 
    "GitHub Actions", "Terraform", "Ansible",
    
    // Mobile Development
    "React Native", "Flutter", "iOS Development", "Android Development", "Xamarin",
    
    // Data & Analytics
    "Apache Spark", "Hadoop", "Kafka", "Airflow", "Pandas", "NumPy", "TensorFlow", "PyTorch",
    
    // Other Technologies
    "GraphQL", "REST APIs", "gRPC", "Microservices", "Blockchain", "Web3", "Socket.io"
  ];

  const experienceLevels = [
    "Intern/Entry Level (0-1 years)",
    "Junior Developer (1-3 years)",
    "Mid-level Developer (3-5 years)",
    "Senior Developer (5-8 years)",
    "Lead Developer (8+ years)",
    "Principal/Staff Engineer (10+ years)"
  ];

  const difficultyLevels = ["Easy", "Intermediate", "Hard"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New AI Interview</DialogTitle>
          <DialogDescription>
            Set up a new AI-powered mock interview session. Choose your technology stack and difficulty level.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Interview Title</Label>
            <Input
              id="title"
              placeholder="e.g., Frontend React Interview"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technology">Technology/Framework</Label>
            <Select 
              value={formData.technology} 
              onValueChange={(value) => setFormData({ ...formData, technology: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select technology" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {technologies.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Select 
              value={formData.experience_level} 
              onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select 
              value={formData.difficulty_level} 
              onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formData.title || !formData.technology || !formData.experience_level || !formData.difficulty_level}
            >
              Create Interview
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
