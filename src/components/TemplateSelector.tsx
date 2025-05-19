
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
import { Badge } from "@/components/ui/badge";
import { Layout, Briefcase } from "lucide-react";

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
}

export default function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps) {
  const [industry, setIndustry] = useState<string>("all");
  const [layout, setLayout] = useState<string>("all");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates);
  
  useEffect(() => {
    let filtered = templates;
    
    if (industry !== "all") {
      filtered = filtered.filter(t => t.industry === industry);
    }
    
    if (layout !== "all") {
      filtered = filtered.filter(t => t.layout === layout);
    }
    
    setFilteredTemplates(filtered);
  }, [industry, layout]);

  const layoutOptions = [
    { value: "standard", label: "Standard" },
    { value: "modern", label: "Modern" },
    { value: "minimal", label: "Minimal" },
    { value: "bold", label: "Bold" },
    { value: "hubspot", label: "HubSpot" },
    { value: "compact", label: "Compact" },
    { value: "elegant", label: "Elegant" },
    { value: "corporate", label: "Corporate" },
    { value: "creative", label: "Creative" },
    { value: "professional", label: "Professional" }
  ];
  
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h2 className="text-xl font-medium">Choose a Template</h2>
        <div className="flex flex-wrap gap-3">
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-[180px]">
              <Briefcase className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="consultant">Consulting</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={layout} onValueChange={setLayout}>
            <SelectTrigger className="w-[180px]">
              <Layout className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Layouts</SelectItem>
                {layoutOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="capitalize text-xs font-normal">
                      {template.industry}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-xs font-normal">
                      {template.layout}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="h-[160px] bg-slate-50 flex items-center justify-center rounded-md mb-3 overflow-hidden">
                <div className="w-full h-full p-2 flex items-center justify-center">
                  {/* Standard Layout */}
                  {template.layout === "standard" && (
                    <div className="flex gap-4 border p-3 w-full h-full">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0"></div>
                      <div className="flex flex-col justify-center">
                        <div className="w-32 h-3 bg-slate-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-slate-200 rounded mb-2"></div>
                        <div className="w-28 h-2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Modern Layout */}
                  {template.layout === "modern" && (
                    <div className="flex flex-col w-full h-full border p-3">
                      <div className="w-full flex justify-center mb-3">
                        <div className="w-32 h-3 bg-slate-300 rounded"></div>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <div className="w-14 h-14 bg-slate-200 rounded-full"></div>
                        <div className="flex flex-col justify-center">
                          <div className="w-24 h-2.5 bg-slate-300 rounded mb-2"></div>
                          <div className="w-28 h-2 bg-slate-200 rounded mb-1"></div>
                          <div className="w-20 h-2 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Minimal Layout */}
                  {template.layout === "minimal" && (
                    <div className="flex w-full h-full p-3">
                      <div className="border-l-4 border-slate-300 pl-3 py-2">
                        <div className="w-28 h-2.5 bg-slate-300 rounded mb-3"></div>
                        <div className="w-20 h-2 bg-slate-200 rounded mb-2"></div>
                        <div className="w-32 h-2 bg-slate-200 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bold Layout */}
                  {template.layout === "bold" && (
                    <div className="bg-slate-700 p-3 w-full h-full flex items-center">
                      <div className="flex flex-col w-full">
                        <div className="flex justify-center mb-3">
                          <div className="w-20 h-20 bg-slate-500 rounded-full"></div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-3 bg-white rounded mb-2"></div>
                          <div className="w-24 h-2 bg-white rounded opacity-80 mb-2"></div>
                          <div className="bg-slate-400 text-slate-800 px-3 py-1 rounded text-xs">Contact Me</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Hubspot Layout */}
                  {template.layout === "hubspot" && (
                    <div className="border w-full h-full flex">
                      <div className="w-1/3 h-full border-r flex items-center justify-center bg-slate-100">
                        <div className="w-12 h-12 bg-slate-300 rounded-full"></div>
                      </div>
                      <div className="w-2/3 p-3">
                        <div className="w-24 h-3 bg-slate-300 rounded mb-2"></div>
                        <div className="w-20 h-2 bg-slate-200 rounded mb-2"></div>
                        <div className="w-28 h-2 bg-slate-200 rounded mb-2"></div>
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
                          <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Compact Layout */}
                  {template.layout === "compact" && (
                    <div className="border w-full h-full p-3">
                      <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <div className="w-24 h-3 bg-slate-300 rounded"></div>
                        <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="w-20 h-2 bg-slate-200 rounded mb-1"></div>
                          <div className="w-16 h-2 bg-slate-200 rounded mb-1"></div>
                          <div className="w-24 h-2 bg-slate-200 rounded"></div>
                        </div>
                        <div className="flex gap-1.5">
                          <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
                          <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Elegant Layout */}
                  {template.layout === "elegant" && (
                    <div className="border w-full h-full p-3 flex bg-slate-50">
                      <div className="w-2/3 pr-3 border-r">
                        <div className="w-28 h-3 bg-slate-400 rounded mb-3"></div>
                        <div className="w-20 h-2 bg-slate-300 rounded mb-1.5"></div>
                        <div className="w-24 h-2 bg-slate-300 rounded mb-1.5"></div>
                        <div className="w-32 h-2 bg-slate-300 rounded"></div>
                      </div>
                      <div className="w-1/3 flex items-center justify-center pl-3">
                        <div className="w-14 h-14 bg-slate-300 rounded-full"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Corporate Layout */}
                  {template.layout === "corporate" && (
                    <div className="border-2 border-slate-400 w-full h-full flex flex-col">
                      <div className="bg-slate-400 h-6 flex items-center px-3">
                        <div className="w-20 h-2 bg-white rounded"></div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-center">
                        <div className="w-28 h-3 bg-slate-400 rounded mb-3"></div>
                        <div className="w-32 h-2 bg-slate-300 rounded mb-1.5"></div>
                        <div className="w-20 h-2 bg-slate-300 rounded mb-3"></div>
                        <div className="w-24 h-6 bg-slate-400 rounded flex items-center justify-center">
                          <div className="w-16 h-2 bg-white rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Creative Layout */}
                  {template.layout === "creative" && (
                    <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 p-3 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full mb-3 shadow-md"></div>
                      <div className="text-center">
                        <div className="w-24 h-3 bg-white rounded mx-auto mb-2"></div>
                        <div className="w-32 h-2 bg-white rounded mb-2 mx-auto"></div>
                        <div className="flex justify-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-white rounded-full"></div>
                          <div className="w-5 h-5 bg-white rounded-full"></div>
                          <div className="w-5 h-5 bg-white rounded-full"></div>
                        </div>
                        <div className="w-20 h-6 bg-white bg-opacity-80 rounded mx-auto"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Professional Layout */}
                  {template.layout === "professional" && (
                    <div className="w-full h-full border flex">
                      <div className="w-1/4 bg-slate-700 flex items-center justify-center">
                        <div className="w-10 h-10 bg-slate-300 rounded-full"></div>
                      </div>
                      <div className="w-3/4 p-3">
                        <div className="w-28 h-3 bg-slate-700 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-slate-400 rounded mb-2"></div>
                        <div className="w-32 h-2 bg-slate-300 rounded mb-1"></div>
                        <div className="w-20 h-2 bg-slate-300 rounded mb-2"></div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1.5">
                            <div className="w-4 h-4 bg-slate-700 rounded"></div>
                            <div className="w-4 h-4 bg-slate-700 rounded"></div>
                          </div>
                          <div className="w-16 h-5 bg-slate-700 rounded flex items-center justify-center">
                            <div className="w-10 h-1.5 bg-white rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
