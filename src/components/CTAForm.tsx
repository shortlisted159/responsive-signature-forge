
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SignatureData } from "@/lib/signatureStorage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CTAFormProps {
  signature: SignatureData;
  onUpdate: (updatedSignature: SignatureData) => void;
}

export default function CTAForm({ signature, onUpdate }: CTAFormProps) {
  const { cta, settings } = signature.data;

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

  const handleLayoutChange = (value: "standard" | "modern" | "minimal" | "bold" | "hubspot" | "compact") => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        settings: {
          ...signature.data.settings,
          layout: value
        }
      }
    };
    onUpdate(updatedSignature);
  };

  const handleImagePositionChange = (value: "left" | "right" | "top" | "none") => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        settings: {
          ...signature.data.settings,
          imagePosition: value
        }
      }
    };
    onUpdate(updatedSignature);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium">Call-to-Action & Layout</h2>
        <p className="text-sm text-muted-foreground">
          Customize your signature's call-to-action button and layout
        </p>
      </div>
      
      {/* CTA Button Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium">Call-to-Action Button</h3>
        
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
      </div>
      
      {/* Layout Options */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-base font-medium">Layout Style</h3>
        <div className="grid grid-cols-2 gap-6">
          <RadioGroup value={settings.layout} onValueChange={handleLayoutChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="standard" id="layout-standard" className="peer sr-only" />
              <Label 
                htmlFor="layout-standard"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
              >
                <div className="w-full h-16 bg-white border mb-2 flex items-center justify-center">
                  <div className="w-1/4 h-8 bg-slate-200 rounded-full mx-2"></div>
                  <div className="w-3/4">
                    <div className="w-3/4 h-2 bg-slate-200 rounded mb-2"></div>
                    <div className="w-1/2 h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <span>Standard</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="modern" id="layout-modern" className="peer sr-only" />
              <Label 
                htmlFor="layout-modern"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
              >
                <div className="w-full h-16 bg-white border mb-2 flex flex-col items-center justify-center">
                  <div className="w-full flex justify-center mb-1">
                    <div className="w-1/3 h-2 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-full flex gap-2 justify-center items-center">
                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                    <div className="flex flex-col">
                      <div className="w-20 h-1.5 bg-slate-200 rounded mb-1"></div>
                      <div className="w-16 h-1.5 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
                <span>Modern</span>
              </Label>
            </div>
          </RadioGroup>
          
          <RadioGroup value={settings.layout} onValueChange={handleLayoutChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="minimal" id="layout-minimal" className="peer sr-only" />
              <Label 
                htmlFor="layout-minimal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
              >
                <div className="w-full h-16 bg-white border mb-2 flex items-center justify-center">
                  <div className="border-l-4 border-slate-300 pl-2 py-1">
                    <div className="w-24 h-2 bg-slate-200 rounded mb-2"></div>
                    <div className="w-20 h-2 bg-slate-200 rounded mb-1"></div>
                    <div className="w-32 h-1.5 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <span>Minimal</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="bold" id="layout-bold" className="peer sr-only" />
              <Label 
                htmlFor="layout-bold"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
              >
                <div className="w-full h-16 bg-slate-700 border mb-2 flex items-center justify-center p-2">
                  <div className="w-1/4 h-10 bg-slate-500 rounded-full mx-2"></div>
                  <div className="w-3/4">
                    <div className="w-3/4 h-2 bg-white rounded mb-2"></div>
                    <div className="w-1/2 h-2 bg-white rounded mb-1"></div>
                    <div className="w-16 h-5 bg-white rounded mt-1"></div>
                  </div>
                </div>
                <span>Bold</span>
              </Label>
            </div>
          </RadioGroup>
          
          <RadioGroup value={settings.layout} onValueChange={handleLayoutChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="hubspot" id="layout-hubspot" className="peer sr-only" />
              <Label 
                htmlFor="layout-hubspot"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
              >
                <div className="w-full h-16 bg-white border mb-2 flex items-center">
                  <div className="w-1/3 h-full border-r flex items-center justify-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="w-2/3 px-2">
                    <div className="w-3/4 h-2 bg-slate-200 rounded mb-2"></div>
                    <div className="w-1/2 h-2 bg-slate-200 rounded mb-1"></div>
                    <div className="flex mt-1 gap-1">
                      <div className="w-6 h-3 bg-slate-200 rounded"></div>
                      <div className="w-6 h-3 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
                <span>HubSpot</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="compact" id="layout-compact" className="peer sr-only" />
              <Label 
                htmlFor="layout-compact"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
              >
                <div className="w-full h-16 bg-white border mb-2 flex flex-col items-center justify-center p-2">
                  <div className="w-full flex justify-between items-center">
                    <div className="w-20 h-2 bg-slate-200 rounded"></div>
                    <div className="w-10 h-6 border bg-slate-50 rounded flex items-center justify-center">
                      <div className="w-6 h-1.5 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-full h-px bg-slate-200 my-2"></div>
                  <div className="w-full flex gap-1">
                    <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
                <span>Compact</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      {/* Photo Position */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-base font-medium">Photo Position</h3>
        <RadioGroup value={settings.imagePosition} onValueChange={handleImagePositionChange} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <RadioGroupItem value="left" id="img-left" className="peer sr-only" />
            <Label 
              htmlFor="img-left"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-slate-300 rounded-full mr-2"></div>
                <div>
                  <div className="w-12 h-1.5 bg-slate-300 rounded mb-1"></div>
                  <div className="w-10 h-1.5 bg-slate-300 rounded"></div>
                </div>
              </div>
              <span className="text-xs">Left</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="right" id="img-right" className="peer sr-only" />
            <Label 
              htmlFor="img-right"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
            >
              <div className="flex items-center mb-2">
                <div>
                  <div className="w-12 h-1.5 bg-slate-300 rounded mb-1"></div>
                  <div className="w-10 h-1.5 bg-slate-300 rounded"></div>
                </div>
                <div className="w-8 h-8 bg-slate-300 rounded-full ml-2"></div>
              </div>
              <span className="text-xs">Right</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="top" id="img-top" className="peer sr-only" />
            <Label 
              htmlFor="img-top"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
            >
              <div className="flex flex-col items-center mb-2">
                <div className="w-8 h-8 bg-slate-300 rounded-full mb-1"></div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-1.5 bg-slate-300 rounded mb-1"></div>
                  <div className="w-10 h-1.5 bg-slate-300 rounded"></div>
                </div>
              </div>
              <span className="text-xs">Top</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="none" id="img-none" className="peer sr-only" />
            <Label 
              htmlFor="img-none"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-200 peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple"
            >
              <div className="flex flex-col items-center mb-2">
                <div>
                  <div className="w-12 h-1.5 bg-slate-300 rounded mb-1"></div>
                  <div className="w-10 h-1.5 bg-slate-300 rounded"></div>
                </div>
              </div>
              <span className="text-xs">None</span>
            </Label>
          </div>
        </RadioGroup>
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
