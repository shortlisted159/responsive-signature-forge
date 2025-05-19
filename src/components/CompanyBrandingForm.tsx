
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignatureData } from "@/lib/signatureStorage";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Lock, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyBrandingFormProps {
  signature: SignatureData;
  onUpdate: (updatedSignature: SignatureData) => void;
}

export default function CompanyBrandingForm({ signature, onUpdate }: CompanyBrandingFormProps) {
  const { branding } = signature.data;
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        branding: {
          ...signature.data.branding,
          [field]: value
        }
      }
    };
    onUpdate(updatedSignature);
    
    // Add toast feedback
    toast({
      title: "Branding updated",
      description: `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated`,
      duration: 1500,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo file size should be less than 1MB",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleChange('logoUrl', event.target.result.toString());
        toast({
          title: "Logo updated",
          description: "Your company logo has been updated",
          duration: 2000,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const fonts = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Helvetica, sans-serif", label: "Helvetica" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Verdana, sans-serif", label: "Verdana" },
    { value: "Tahoma, sans-serif", label: "Tahoma" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Company Branding</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              type="color"
              value={branding.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="w-12 h-10 p-1 interactive-element"
            />
            <Input
              type="text"
              value={branding.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="flex-1 interactive-element"
              placeholder="#1E5245"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <div className="flex gap-2">
            <Input
              id="secondaryColor"
              type="color"
              value={branding.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="w-12 h-10 p-1 interactive-element"
            />
            <Input
              type="text"
              value={branding.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="flex-1 interactive-element"
              placeholder="#3D8573"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="font">Font Family</Label>
          <Select 
            value={branding.font} 
            onValueChange={(value) => handleChange('font', value)}
          >
            <SelectTrigger id="font" className="w-full bg-white dark:bg-slate-800 interactive-element">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent position="popper" className="glass-effect">
              {fonts.map((font) => (
                <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </SelectItem>
              ))}
              <SelectItem disabled value="premium" className="text-muted-foreground">
                <div className="flex items-center">
                  <Lock className="h-3 w-3 mr-2" />
                  <span>More fonts (Premium)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="logo">Company Logo</Label>
          <div className="flex flex-col items-center border-2 border-dashed border-muted rounded-md p-4 transition-colors hover:border-muted-foreground/50 glass-effect">
            {branding.logoUrl ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <img
                  src={branding.logoUrl}
                  alt="Company logo"
                  className="max-h-28 max-w-full object-contain mb-2"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    className="interactive-element hover:bg-brand-light-green hover:text-brand-dark-green"
                  >
                    Change Logo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      handleChange('logoUrl', '');
                      toast({
                        title: "Logo removed",
                        description: "Your company logo has been removed",
                        duration: 2000,
                      });
                    }}
                    className="interactive-element hover:bg-brand-light-green hover:text-brand-dark-green"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="ghost"
                onClick={() => logoInputRef.current?.click()}
                className="flex flex-col items-center py-8 interactive-element hover:bg-brand-light-green hover:text-brand-dark-green"
              >
                <Upload className="h-10 w-10 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mb-1">Click to upload logo</span>
                <span className="text-xs text-muted-foreground">SVG, PNG, JPG (max. 1MB)</span>
              </Button>
            )}
            <input
              ref={logoInputRef}
              id="logo"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
