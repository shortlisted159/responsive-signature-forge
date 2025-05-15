
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PhotoCropperProps {
  imageUrl: string;
  onProcessedImage: (newImageUrl: string) => void;
  onCancel: () => void;
}

export default function PhotoCropper({ imageUrl, onProcessedImage, onCancel }: PhotoCropperProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropType, setCropType] = useState<"circle" | "square">("circle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (canvasRef.current && imageRef.current) {
        imageRef.current.src = imageUrl;
        setImageLoaded(true);
        drawImage();
      }
    };
    img.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load image for cropping",
        variant: "destructive"
      });
    };
    img.src = imageUrl;
  }, [imageUrl, cropType]);

  const drawImage = () => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;
      
      if (!ctx) return;
      
      const size = Math.min(img.naturalWidth, img.naturalHeight);
      canvas.width = size;
      canvas.height = size;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate the centered crop region
      const sx = (img.naturalWidth - size) / 2;
      const sy = (img.naturalHeight - size) / 2;
      
      // Draw the image
      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
      
      // Apply circular crop if needed
      if (cropType === "circle") {
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      
      // Save the cropped image
      const croppedImageUrl = canvas.toDataURL("image/png");
      setCroppedImage(croppedImageUrl);
    } catch (error) {
      console.error("Error drawing image:", error);
      toast({
        title: "Error",
        description: "Failed to process image for cropping",
        variant: "destructive"
      });
    }
  };

  const handleCropTypeChange = (type: "circle" | "square") => {
    setCropType(type);
  };

  const applyCrop = () => {
    if (!canvasRef.current) return;
    
    setIsProcessing(true);
    
    try {
      // Small delay for better UX
      setTimeout(() => {
        if (croppedImage) {
          onProcessedImage(croppedImage);
        }
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      console.error("Error applying crop:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to apply crop",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-700 mb-4">
      <h3 className="text-base font-medium mb-4">Crop Photo</h3>
      
      <div className="flex flex-col items-center mb-4">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-4 w-full max-w-xs flex justify-center">
          <div className={cn(
            "relative overflow-hidden",
            cropType === "circle" ? "rounded-full" : "rounded-md"
          )}>
            <canvas 
              ref={canvasRef}
              className="max-w-full max-h-40 block"
            />
            <img 
              ref={imageRef}
              src={imageUrl}
              className="hidden"
              alt="Source"
              crossOrigin="anonymous"
              onLoad={() => drawImage()}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <div>
            <input 
              type="radio" 
              id="crop-circle" 
              checked={cropType === "circle"} 
              onChange={() => handleCropTypeChange("circle")} 
              className="sr-only peer"
            />
            <Label 
              htmlFor="crop-circle" 
              className="flex flex-col items-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground peer-checked:border-brand-purple peer-checked:bg-brand-purple/5"
            >
              <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-1">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
              </div>
              <span className="text-xs">Circle</span>
            </Label>
          </div>
          <div>
            <input 
              type="radio" 
              id="crop-square" 
              checked={cropType === "square"} 
              onChange={() => handleCropTypeChange("square")} 
              className="sr-only peer"
            />
            <Label 
              htmlFor="crop-square" 
              className="flex flex-col items-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground peer-checked:border-brand-purple peer-checked:bg-brand-purple/5"
            >
              <div className="w-12 h-12 border-2 border-current flex items-center justify-center mb-1">
                <div className="w-8 h-8 bg-muted"></div>
              </div>
              <span className="text-xs">Square</span>
            </Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={applyCrop}
          disabled={isProcessing || !imageLoaded}
          className={cn(isProcessing && "opacity-80")}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Apply Crop"
          )}
        </Button>
      </div>
    </div>
  );
}
