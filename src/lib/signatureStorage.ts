
import { toast } from "@/components/ui/sonner";

export type SignatureData = {
  id: string;
  name: string;
  templateId: string;
  dateCreated: string;
  dateModified: string;
  data: {
    personalInfo: {
      name: string;
      title: string;
      company: string;
      email: string;
      phone: string;
      website: string;
      address: string;
      photoUrl?: string;
      tagline: string;
    };
    socialLinks: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      [key: string]: string | undefined;
    };
    branding: {
      primaryColor: string;
      secondaryColor: string;
      font: string;
      logoUrl?: string;
    };
    cta: {
      text: string;
      url: string;
      color: string;
    };
    settings: {
      imagePosition: "left" | "right" | "top" | "none";
      socialIconStyle: "color" | "monochrome" | "circle" | "square";
      layout: "standard" | "modern" | "minimal" | "bold";
    };
    premium?: {
      seasonal?: {
        enabled: boolean;
        variations: Array<{
          startDate: string;
          endDate: string;
          message: string;
          theme: string;
        }>;
      };
      conditionalContent?: {
        enabled: boolean;
        blocks: Array<{
          condition: string;
          content: string;
        }>;
      };
      tracking?: {
        enabled: boolean;
      };
      calendar?: {
        enabled: boolean;
        url: string;
      };
    };
  };
};

const STORAGE_KEY = 'email-signature-data';

export const saveSignature = (signature: SignatureData): void => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    let signatures: SignatureData[] = [];
    
    if (existingData) {
      signatures = JSON.parse(existingData);
      
      // Find if this signature already exists
      const index = signatures.findIndex(sig => sig.id === signature.id);
      if (index >= 0) {
        // Update existing signature
        signatures[index] = {
          ...signature,
          dateModified: new Date().toISOString()
        };
      } else {
        // Add new signature
        signatures.push(signature);
      }
    } else {
      // First signature
      signatures = [signature];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
    toast.success("Signature saved successfully");
  } catch (error) {
    console.error("Error saving signature", error);
    toast.error("Failed to save signature");
  }
};

export const getSignatures = (): SignatureData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting signatures", error);
    toast.error("Failed to load saved signatures");
    return [];
  }
};

export const getSignatureById = (id: string): SignatureData | undefined => {
  try {
    const signatures = getSignatures();
    return signatures.find(sig => sig.id === id);
  } catch (error) {
    console.error("Error getting signature", error);
    return undefined;
  }
};

export const deleteSignature = (id: string): boolean => {
  try {
    const signatures = getSignatures();
    const filteredSignatures = signatures.filter(sig => sig.id !== id);
    
    if (signatures.length === filteredSignatures.length) {
      return false; // No signature was deleted
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSignatures));
    toast.success("Signature deleted");
    return true;
  } catch (error) {
    console.error("Error deleting signature", error);
    toast.error("Failed to delete signature");
    return false;
  }
};

export const createNewSignature = (templateId: string, name: string = "Untitled Signature"): SignatureData => {
  const now = new Date().toISOString();
  return {
    id: `sig_${Date.now()}`,
    name,
    templateId,
    dateCreated: now,
    dateModified: now,
    data: {
      personalInfo: {
        name: "",
        title: "",
        company: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        tagline: ""
      },
      socialLinks: {},
      branding: {
        primaryColor: "#7E69AB",
        secondaryColor: "#E5DEFF",
        font: "Arial, sans-serif"
      },
      cta: {
        text: "Learn More",
        url: "https://www.example.com",
        color: "#9b87f5"
      },
      settings: {
        imagePosition: "left",
        socialIconStyle: "color",
        layout: "standard"
      }
    }
  };
};
