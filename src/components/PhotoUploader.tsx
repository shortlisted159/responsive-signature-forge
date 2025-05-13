
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SignatureData } from "@/lib/signatureStorage";
import { Upload, Image, Crop, Filter, Scissors } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import BackgroundRemover from "./BackgroundRemover";
import PhotoFilter from "./PhotoFilter";
import PhotoCropper from "./PhotoCropper";

interface PhotoUploaderProps {
  signature: SignatureData;
  onUpdate: (updatedSignature: SignatureData) => void;
}

export default function PhotoUploader({ signature, onUpdate }: PhotoUploaderProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { personalInfo, settings } = signature.data;
  const [isUploading, setIsUploading] = useState(false);
  const [activeEditor, setActiveEditor] = useState<"none" | "crop" | "filter" | "bgremove">("none");
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Photo file size should be less than 2MB");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updatePhotoUrl(event.target.result.toString());
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const updatePhotoUrl = (photoUrl: string) => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        personalInfo: {
          ...signature.data.personalInfo,
          photoUrl
        }
      }
    };
    onUpdate(updatedSignature);
  };

  const handlePositionChange = (position: string) => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        settings: {
          ...signature.data.settings,
          imagePosition: position as "left" | "right" | "top" | "none"
        }
      }
    };
    onUpdate(updatedSignature);
  };

  const removePhoto = () => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        personalInfo: {
          ...signature.data.personalInfo,
          photoUrl: undefined
        }
      }
    };
    onUpdate(updatedSignature);
  };

  const handleProcessedImage = (newImageUrl: string) => {
    updatePhotoUrl(newImageUrl);
    setActiveEditor("none");
  };

  const handleCancelEdit = () => {
    setActiveEditor("none");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Professional Photo</h2>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="photoPosition">Photo Position</Label>
          <Select 
            value={settings.imagePosition} 
            onValueChange={handlePositionChange}
          >
            <SelectTrigger id="photoPosition" className="w-full">
              <SelectValue placeholder="Select photo position" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="left">Left Side</SelectItem>
              <SelectItem value="right">Right Side</SelectItem>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="none">No Photo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {settings.imagePosition !== 'none' && (
          <div className="space-y-2">
            <Label>Upload Photo</Label>
            <div className="flex flex-col items-center border-2 border-dashed border-muted rounded-md p-4 transition-colors hover:border-muted-foreground/50">
              {personalInfo.photoUrl ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="h-32 w-32 rounded-full overflow-hidden bg-muted">
                    <img
                      src={personalInfo.photoUrl}
                      alt="Professional photo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      Change Photo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={removePhoto}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="ghost"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex flex-col items-center py-8 w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin h-10 w-10 mb-2 border-4 border-muted-foreground border-t-transparent rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Image className="h-10 w-10 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground mb-1">Click to upload photo</span>
                      <span className="text-xs text-muted-foreground">PNG, JPG (max. 2MB)</span>
                    </>
                  )}
                </Button>
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>
        )}

        {personalInfo.photoUrl && settings.imagePosition !== 'none' && activeEditor === "none" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-4 h-auto"
              onClick={() => setActiveEditor("crop")}
            >
              <Crop className="h-5 w-5 text-brand-purple mb-2" />
              <h4 className="text-sm font-medium mb-1">Cropping</h4>
              <p className="text-xs text-muted-foreground">
                Crop your photo to fit perfectly
              </p>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-4 h-auto"
              onClick={() => setActiveEditor("filter")}
            >
              <Filter className="h-5 w-5 text-brand-purple mb-2" />
              <h4 className="text-sm font-medium mb-1">Filters</h4>
              <p className="text-xs text-muted-foreground">
                Apply professional filters
              </p>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-4 h-auto"
              onClick={() => setActiveEditor("bgremove")}
            >
              <Scissors className="h-5 w-5 text-brand-purple mb-2" />
              <h4 className="text-sm font-medium mb-1">Background Removal</h4>
              <p className="text-xs text-muted-foreground">
                Remove background for a clean look
              </p>
            </Button>
          </div>
        )}
        
        {personalInfo.photoUrl && activeEditor === "crop" && (
          <PhotoCropper 
            imageUrl={personalInfo.photoUrl} 
            onProcessedImage={handleProcessedImage}
            onCancel={handleCancelEdit}
          />
        )}
        
        {personalInfo.photoUrl && activeEditor === "filter" && (
          <PhotoFilter
            imageUrl={personalInfo.photoUrl}
            onProcessedImage={handleProcessedImage}
            onCancel={handleCancelEdit}
          />
        )}
        
        {personalInfo.photoUrl && activeEditor === "bgremove" && (
          <BackgroundRemover
            imageUrl={personalInfo.photoUrl}
            onProcessedImage={handleProcessedImage}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
}
