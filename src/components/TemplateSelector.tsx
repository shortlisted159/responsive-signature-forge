
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { templates, Template } from "@/lib/templateData";

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
}

export default function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps) {
  const [industry, setIndustry] = useState<string>("all");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates);
  
  useEffect(() => {
    if (industry === "all") {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(t => t.industry === industry));
    }
  }, [industry]);
  
  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-medium">Choose a Template</h2>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="realtor">Real Estate</SelectItem>
              <SelectItem value="consultant">Consulting</SelectItem>
              <SelectItem value="lawyer">Legal</SelectItem>
              <SelectItem value="coach">Coaching</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="overflow-hidden border hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{template.industry} • {template.layout}</p>
                </div>
              </div>
              <div className="h-[120px] bg-slate-100 flex items-center justify-center rounded-md mb-3">
                {/* Template preview image */}
                <div className="text-xs text-slate-400">Signature Preview</div>
              </div>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => onTemplateSelect(template)}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
