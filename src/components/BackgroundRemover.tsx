
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BackgroundRemoverProps {
  imageUrl: string;
  onProcessedImage: (newImageUrl: string) => void;
  onCancel: () => void;
}

export default function BackgroundRemover({ imageUrl, onProcessedImage, onCancel }: BackgroundRemoverProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  // Load the original image once when component mounts
  useEffect(() => {
    const loadOriginalImage = async () => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load original image"));
          img.src = imageUrl;
        });
        
        setOriginalImage(img);
      } catch (error) {
        console.error("Error loading original image:", error);
        toast({
          title: "Error",
          description: "Failed to load the original image",
          variant: "destructive"
        });
      }
    };
    
    loadOriginalImage();
  }, [imageUrl]);

  const handleRemoveBackground = async () => {
    if (!originalImage) {
      toast({
        title: "Error",
        description: "Image not loaded yet. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      // Create canvas and remove background
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Set canvas dimensions
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      
      // Draw the image on the canvas
      ctx.drawImage(originalImage, 0, 0);
      
      // Simple background removal (this is a placeholder - the actual implementation would use AI segmentation)
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2.2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      
      // Get the processed image as data URL
      const processedImageUrl = canvas.toDataURL("image/png");
      setProcessedImage(processedImageUrl);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Small delay to show 100% progress
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 500);
      
    } catch (error) {
      console.error("Error removing background:", error);
      setIsProcessing(false);
      setProgress(0);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleApply = () => {
    if (processedImage) {
      onProcessedImage(processedImage);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-700 mb-4">
      <h3 className="text-base font-medium mb-4">Background Removal</h3>
      
      <div className="flex gap-4 mb-4">
        <div className="border rounded-md p-2 flex-1 dark:border-slate-700">
          <p className="text-xs mb-2 text-muted-foreground">Original</p>
          <div className="aspect-square w-full max-h-40 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800">
            {originalImage ? (
              <img src={imageUrl} alt="Original" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </div>
        </div>
        
        <div className="border rounded-md p-2 flex-1 dark:border-slate-700">
          <p className="text-xs mb-2 text-muted-foreground">Preview</p>
          <div className="aspect-square w-full max-h-40 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAAADlJREFUOBFjZGBgEAFifOANEwOJgGQDJEjUP2oAwnP/0QAi3QCSQcQCUgMRZNASjAR8YcDIyMgIAKRQBAJBaVXnAAAAAElFTkSuQmCC')]">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin mb-2 text-brand-purple" />
                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                  <div 
                    className="h-full bg-brand-purple rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-muted-foreground">{progress}%</p>
              </div>
            ) : processedImage ? (
              <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="opacity-50 flex flex-col items-center justify-center h-full">
                <p className="text-xs text-muted-foreground">Click "Remove Background" to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        {processedImage ? (
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleApply}
          >
            Apply Changes
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleRemoveBackground}
            disabled={isProcessing || !originalImage}
            className={cn(isProcessing && "opacity-80")}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Remove Background"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
