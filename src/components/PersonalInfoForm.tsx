
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignatureData } from "@/lib/signatureStorage";

interface PersonalInfoFormProps {
  signature: SignatureData;
  onUpdate: (updatedSignature: SignatureData) => void;
}

export default function PersonalInfoForm({ signature, onUpdate }: PersonalInfoFormProps) {
  const { personalInfo } = signature.data;
  
  const handleChange = (field: string, value: string) => {
    const updatedSignature = {
      ...signature,
      data: {
        ...signature.data,
        personalInfo: {
          ...signature.data.personalInfo,
          [field]: value
        }
      }
    };
    onUpdate(updatedSignature);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Personal Information</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Jane Doe"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={personalInfo.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Marketing Manager"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={personalInfo.company}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="Acme Corporation"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="jane.doe@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={personalInfo.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="www.example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={personalInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main St, City, State"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline or Quote</Label>
          <Textarea
            id="tagline"
            value={personalInfo.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Your personal or professional tagline"
            className="resize-none h-20"
          />
        </div>
      </div>
    </div>
  );
}
