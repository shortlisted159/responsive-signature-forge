
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SignatureData } from "@/lib/signatureStorage";

interface CTAFormProps {
  signature: SignatureData;
  onUpdate: (updatedSignature: SignatureData) => void;
}

export default function CTAForm({ signature, onUpdate }: CTAFormProps) {
  const { cta } = signature.data;

  const handleChange = (field: string, value: string) => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        cta: {
          ...signature.data.cta,
          [field]: value
        }
      }
    };
    onUpdate(updatedSignature);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Call-to-Action Button</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ctaText">Button Text</Label>
          <Input
            id="ctaText"
            value={cta.text}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="Learn More"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ctaUrl">Button URL</Label>
          <Input
            id="ctaUrl"
            value={cta.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ctaColor">Button Color</Label>
          <div className="flex gap-2">
            <Input
              id="ctaColor"
              type="color"
              value={cta.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={cta.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="flex-1"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-md bg-muted/50 p-3 mt-4">
        <p className="text-xs text-muted-foreground">
          Add a call-to-action button to encourage recipients to engage with your business.
          Consider linking to your calendar, services page, or a special offer.
        </p>
      </div>
    </div>
  );
}
