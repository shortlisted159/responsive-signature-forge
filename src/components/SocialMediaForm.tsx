
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SignatureData } from "@/lib/signatureStorage";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

interface SocialMediaFormProps {
  signature: SignatureData;
  onUpdate: (updatedSignature: SignatureData) => void;
}

export default function SocialMediaForm({ signature, onUpdate }: SocialMediaFormProps) {
  const { socialLinks, settings } = signature.data;

  const handleLinkChange = (platform: string, value: string) => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        socialLinks: {
          ...signature.data.socialLinks,
          [platform]: value
        }
      }
    };
    onUpdate(updatedSignature);
  };

  const handleIconStyleChange = (style: string) => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        settings: {
          ...signature.data.settings,
          socialIconStyle: style as "color" | "monochrome" | "circle" | "square"
        }
      }
    };
    onUpdate(updatedSignature);
  };

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Social Media</h2>
      
      <div className="space-y-2 mb-4">
        <Label htmlFor="socialIconStyle">Icon Style</Label>
        <Select 
          value={settings.socialIconStyle} 
          onValueChange={handleIconStyleChange}
        >
          <SelectTrigger id="socialIconStyle" className="w-full">
            <SelectValue placeholder="Select icon style" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="color">Color Icons</SelectItem>
            <SelectItem value="monochrome">Monochrome Icons</SelectItem>
            <SelectItem value="circle">Circle Background</SelectItem>
            <SelectItem value="square">Square Background</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {[
          { platform: 'linkedin', label: 'LinkedIn' },
          { platform: 'twitter', label: 'Twitter' },
          { platform: 'facebook', label: 'Facebook' },
          { platform: 'instagram', label: 'Instagram' }
        ].map(({ platform, label }) => (
          <div key={platform} className="space-y-2">
            <Label htmlFor={platform} className="flex items-center gap-2">
              {renderPlatformIcon(platform)} {label}
            </Label>
            <Input
              id={platform}
              value={socialLinks[platform] || ''}
              onChange={(e) => handleLinkChange(platform, e.target.value)}
              placeholder={`Your ${label} profile URL`}
            />
          </div>
        ))}
      </div>
      
      <div className="rounded-md bg-muted/50 p-3 mt-4">
        <p className="text-xs text-muted-foreground">
          Enter your complete profile URLs or just your username. 
          You can leave empty any platforms you don't want to include.
        </p>
      </div>
    </div>
  );
}
