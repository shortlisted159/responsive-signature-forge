
import { useState, useRef } from "react";
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

interface CompanyBrandingFormProps {
  signature: SignatureData;
  onUpdate: (updatedSignature: SignatureData) => void;
}

export default function CompanyBrandingForm({ signature, onUpdate }: CompanyBrandingFormProps) {
  const { branding } = signature.data;
  const logoInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      alert("Logo file size should be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleChange('logoUrl', event.target.result.toString());
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
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={branding.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="flex-1"
              placeholder="#000000"
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
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={branding.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="flex-1"
              placeholder="#CCCCCC"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="font">Font Family</Label>
          <Select 
            value={branding.font} 
            onValueChange={(value) => handleChange('font', value)}
          >
            <SelectTrigger id="font" className="w-full">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent position="popper">
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
          <div className="flex flex-col items-center border-2 border-dashed border-muted rounded-md p-4 transition-colors hover:border-muted-foreground/50">
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
                  >
                    Change Logo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleChange('logoUrl', '')}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="ghost"
                onClick={() => logoInputRef.current?.click()}
                className="flex flex-col items-center py-8"
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
