
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoFilterProps {
  imageUrl: string;
  onProcessedImage: (newImageUrl: string) => void;
  onCancel: () => void;
}

export default function PhotoFilter({ imageUrl, onProcessedImage, onCancel }: PhotoFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState("normal");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isApplying, setIsApplying] = useState(false);

  const filters = [
    { id: "normal", label: "Normal" },
    { id: "grayscale", label: "B&W" },
    { id: "sepia", label: "Sepia" },
    { id: "vibrant", label: "Vibrant" },
    { id: "warm", label: "Warm" },
    { id: "cool", label: "Cool" },
  ];

  const getFilterStyle = (filterId: string) => {
    switch (filterId) {
      case "grayscale":
        return "grayscale(100%)";
      case "sepia":
        return "sepia(70%)";
      case "vibrant":
        return "saturate(150%) contrast(120%)";
      case "warm":
        return "sepia(20%) saturate(140%) hue-rotate(10deg)";
      case "cool":
        return "saturate(90%) hue-rotate(-10deg) brightness(105%)";
      default:
        return "none";
    }
  };

  const getCurrentFilterStyle = () => {
    const baseFilter = getFilterStyle(selectedFilter);
    return `${baseFilter} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  };

  const applyFilter = async () => {
    try {
      setIsApplying(true);
      
      // Create a new image element
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Create canvas and apply filter
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply CSS filter to canvas
      ctx.filter = getCurrentFilterStyle();
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // Get the processed image as data URL
      const processedImageUrl = canvas.toDataURL("image/jpeg", 0.9);
      
      // Small delay for better UX
      setTimeout(() => {
        onProcessedImage(processedImageUrl);
        setIsApplying(false);
      }, 500);
      
    } catch (error) {
      console.error("Error applying filter:", error);
      setIsApplying(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white mb-4">
      <h3 className="text-base font-medium mb-4">Photo Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <div className="border rounded-md p-2 mb-2">
            <div className="aspect-square w-full max-h-40 flex items-center justify-center overflow-hidden bg-slate-100">
              <img 
                src={imageUrl} 
                alt="Filtered preview" 
                className="max-w-full max-h-full object-contain"
                style={{ filter: getCurrentFilterStyle() }}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="brightness">Brightness</Label>
                <span className="text-xs text-muted-foreground">{brightness}%</span>
              </div>
              <Slider
                id="brightness"
                min={50}
                max={150}
                step={1}
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="contrast">Contrast</Label>
                <span className="text-xs text-muted-foreground">{contrast}%</span>
              </div>
              <Slider
                id="contrast"
                min={50}
                max={150}
                step={1}
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="saturation">Saturation</Label>
                <span className="text-xs text-muted-foreground">{saturation}%</span>
              </div>
              <Slider
                id="saturation"
                min={0}
                max={200}
                step={1}
                value={[saturation]}
                onValueChange={(value) => setSaturation(value[0])}
              />
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Filter Presets</p>
          <RadioGroup value={selectedFilter} onValueChange={setSelectedFilter} className="grid grid-cols-2 gap-2">
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-start space-x-2">
                <RadioGroupItem value={filter.id} id={`filter-${filter.id}`} className="peer sr-only" />
                <Label 
                  htmlFor={`filter-${filter.id}`}
                  className="flex flex-col items-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
                >
                  <div className="h-14 w-full mb-1 rounded overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={filter.label}
                      className="w-full h-full object-cover"
                      style={{ filter: getFilterStyle(filter.id) }}
                    />
                  </div>
                  <span className="text-xs">{filter.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={applyFilter}
          disabled={isApplying}
          className={cn(isApplying && "opacity-80")}
        >
          {isApplying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            "Apply Filter"
          )}
        </Button>
      </div>
    </div>
  );
}
