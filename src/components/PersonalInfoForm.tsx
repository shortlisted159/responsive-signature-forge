
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignatureData } from "@/lib/signatureStorage";
import { X } from "lucide-react";

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
  
  const clearField = (field: string) => {
    handleChange(field, '');
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Personal Information</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                id="name"
                value={personalInfo.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Jane Doe"
              />
              {personalInfo.name && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearField('name')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                id="title"
                value={personalInfo.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Marketing Manager"
              />
              {personalInfo.title && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearField('title')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                id="company"
                value={personalInfo.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Acme Corporation"
              />
              {personalInfo.company && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearField('company')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="jane.doe@example.com"
              />
              {personalInfo.email && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearField('email')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
              {personalInfo.phone && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearField('phone')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                id="website"
                value={personalInfo.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="www.example.com"
              />
              {personalInfo.website && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearField('website')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                id="address"
                value={personalInfo.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Main St, City, State"
              />
              {personalInfo.address && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearField('address')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline or Quote</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Textarea
                id="tagline"
                value={personalInfo.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Your personal or professional tagline"
                className="resize-none h-20 pr-8"
              />
              {personalInfo.tagline && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-3 h-6 w-6 p-0"
                  onClick={() => clearField('tagline')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
