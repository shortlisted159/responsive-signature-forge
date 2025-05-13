
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignatureData } from "@/lib/signatureStorage";
import PersonalInfoForm from "./PersonalInfoForm";
import CompanyBrandingForm from "./CompanyBrandingForm";
import SocialMediaForm from "./SocialMediaForm";
import PhotoUploader from "./PhotoUploader";
import CTAForm from "./CTAForm";
import ExportOptions from "./ExportOptions";

interface SignatureEditorProps {
  signature: SignatureData;
  onUpdate: (updatedSignature: SignatureData) => void;
}

export default function SignatureEditor({ signature, onUpdate }: SignatureEditorProps) {
  const [activeTab, setActiveTab] = useState("personal-info");

  const tabItems = [
    { id: "personal-info", label: "Personal Info" },
    { id: "branding", label: "Branding" },
    { id: "social", label: "Social" },
    { id: "photo", label: "Photo" },
    { id: "cta", label: "CTA Button" },
    { id: "export", label: "Export" },
  ];

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        <div className="border-b sticky top-0 bg-background z-10">
          <TabsList className="w-full h-auto justify-start overflow-x-auto whitespace-nowrap scrollbar-hide px-1 py-1">
            {tabItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="px-3 py-1.5 text-sm"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="personal-info" className="mt-0 h-full">
            <PersonalInfoForm signature={signature} onUpdate={onUpdate} />
          </TabsContent>
          
          <TabsContent value="branding" className="mt-0 h-full">
            <CompanyBrandingForm signature={signature} onUpdate={onUpdate} />
          </TabsContent>
          
          <TabsContent value="social" className="mt-0 h-full">
            <SocialMediaForm signature={signature} onUpdate={onUpdate} />
          </TabsContent>
          
          <TabsContent value="photo" className="mt-0 h-full">
            <PhotoUploader signature={signature} onUpdate={onUpdate} />
          </TabsContent>
          
          <TabsContent value="cta" className="mt-0 h-full">
            <CTAForm signature={signature} onUpdate={onUpdate} />
          </TabsContent>
          
          <TabsContent value="export" className="mt-0 h-full">
            <ExportOptions signature={signature} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
