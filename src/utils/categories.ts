
export const CATEGORIES = [
  { value: "javascript", label: "JavaScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "mysql", label: "MySQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "algorithms", label: "Algorithms" },
  { value: "datastructures", label: "Data Structures" },
  { value: "systemdesign", label: "System Design" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Full Stack" },
  { value: "other", label: "Other" }
];

export const getCategoryLabel = (value: string) => {
  const category = CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
};
