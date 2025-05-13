
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignatureData, createNewSignature, getSignatures } from "@/lib/signatureStorage";
import { templates, Template } from "@/lib/templateData";
import TemplateSelector from "@/components/TemplateSelector";
import SignatureEditor from "@/components/SignatureEditor";
import SignaturePreview from "@/components/SignaturePreview";
import SavedSignatures from "@/components/SavedSignatures";
import { Mail } from "lucide-react";

const Index = () => {
  const [step, setStep] = useState<"template" | "editor">("template");
  const [currentSignature, setCurrentSignature] = useState<SignatureData | null>(null);
  const [showSavedView, setShowSavedView] = useState(false);
  
  useEffect(() => {
    // Check if there are any saved signatures
    const savedSignatures = getSignatures();
    if (savedSignatures.length > 0) {
      // Load the most recent signature
      const mostRecent = savedSignatures.sort((a, b) => 
        new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
      )[0];
      setCurrentSignature(mostRecent);
      setStep("editor");
    }
  }, []);

  const handleTemplateSelect = (template: Template) => {
    // Create a new signature from the selected template
    const newSignature = createNewSignature(template.id);

    // Apply template defaults
    const updatedSignature = {
      ...newSignature,
      data: {
        ...newSignature.data,
        personalInfo: {
          ...newSignature.data.personalInfo,
          ...template.defaultValues
        },
        socialLinks: {
          ...template.defaultValues.socialLinks
        },
        settings: {
          ...newSignature.data.settings,
          imagePosition: template.imagePosition,
          socialIconStyle: template.socialIconStyle,
          layout: template.layout
        },
        cta: {
          ...newSignature.data.cta,
          text: template.defaultValues.ctaText,
          url: template.defaultValues.ctaUrl
        }
      }
    };
    
    setCurrentSignature(updatedSignature);
    setStep("editor");
  };

  const handleSignatureUpdate = (updatedSignature: SignatureData) => {
    setCurrentSignature(updatedSignature);
  };

  const handleCreateNew = () => {
    setStep("template");
    setShowSavedView(false);
  };

  const handleSignatureSelect = (signature: SignatureData) => {
    setCurrentSignature(signature);
    setShowSavedView(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white shadow-sm py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand-purple rounded-md p-1.5 transition-all hover:bg-brand-vivid-purple">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold">Email Signature Generator</h1>
          </div>
          <div>
            <Button size="sm" variant="outline" className="hidden md:inline-flex mr-2 hover:bg-brand-light-purple hover:text-brand-dark-purple transition-all">
              Help
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {step === "template" ? (
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-6">
            <TemplateSelector onTemplateSelect={handleTemplateSelect} />
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 max-w-7xl mx-auto w-full p-4 sm:p-6">
            <div className="flex flex-col mb-6 lg:mb-0">
              <div className="bg-white rounded-md border shadow-sm overflow-hidden flex-1 flex flex-col">
                {showSavedView ? (
                  <div className="p-4 overflow-y-auto">
                    <SavedSignatures 
                      currentSignature={currentSignature!}
                      onSignatureSelect={handleSignatureSelect}
                      onCreateNew={handleCreateNew}
                    />
                  </div>
                ) : (
                  <SignatureEditor 
                    signature={currentSignature!}
                    onUpdate={handleSignatureUpdate}
                  />
                )}
                
                <div className="border-t p-3 bg-muted/30 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSavedView(!showSavedView)}
                    className="hover:bg-brand-light-purple hover:text-brand-dark-purple transition-all"
                  >
                    {showSavedView ? "Back to Editor" : "Saved Signatures"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCreateNew}
                    className="hover:bg-brand-light-purple hover:text-brand-dark-purple transition-all"
                  >
                    Create New
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:block">
              <SignaturePreview signature={currentSignature!} />
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-4 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          Email Signature Generator &copy; {new Date().getFullYear()} | Made with ❤️ by Sanjukta Singha
        </p>
      </footer>
    </div>
  );
}

export default Index;
