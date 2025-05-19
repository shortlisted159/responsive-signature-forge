
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignatureData, createNewSignature, getSignatures } from "@/lib/signatureStorage";
import { templates, Template } from "@/lib/templateData";
import TemplateSelector from "@/components/TemplateSelector";
import SignatureEditor from "@/components/SignatureEditor";
import SignaturePreview from "@/components/SignaturePreview";
import SavedSignatures from "@/components/SavedSignatures";
import AppLogo from "@/components/AppLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { HelpCircle } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [step, setStep] = useState<"template" | "editor">("template");
  const [currentSignature, setCurrentSignature] = useState<SignatureData | null>(null);
  const [showSavedView, setShowSavedView] = useState(false);
  const { toast } = useToast();
  
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
    const newSignature = createNewSignature(template.id, template.name + " Signature");

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
    toast({
      title: "Template selected",
      description: `You've selected the ${template.name} template.`,
      duration: 2000,
    });
  };

  const handleSignatureUpdate = (updatedSignature: SignatureData) => {
    setCurrentSignature(updatedSignature);
  };

  const handleCreateNew = () => {
    setStep("template");
    setShowSavedView(false);
    toast({
      title: "Create new signature",
      description: "Select a template to start creating your new signature",
      duration: 2000,
    });
  };

  const handleSignatureSelect = (signature: SignatureData) => {
    setCurrentSignature(signature);
    setShowSavedView(false);
    toast({
      title: "Signature loaded",
      description: `You're now editing ${signature.name}`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm py-3 px-4 sm:px-6 glass-effect">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <AppLogo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              size="sm" 
              variant="outline" 
              className="hidden md:inline-flex mr-2 interactive-element hover:bg-brand-light-green hover:text-brand-dark-green"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
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
              <div className="bg-white dark:bg-slate-900 rounded-md border dark:border-slate-700 shadow-sm overflow-hidden flex-1 flex flex-col glass-effect">
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
                
                <div className="border-t p-3 bg-muted/30 dark:bg-slate-800/50 flex justify-between glass-effect">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setShowSavedView(!showSavedView);
                      toast({
                        title: showSavedView ? "Back to editor" : "Saved signatures",
                        description: showSavedView ? "Editing current signature" : "View your saved signatures",
                        duration: 1500,
                      });
                    }}
                    className="interactive-element hover:bg-brand-light-green hover:text-brand-dark-green"
                  >
                    {showSavedView ? "Back to Editor" : "Saved Signatures"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCreateNew}
                    className="interactive-element hover:bg-brand-light-green hover:text-brand-dark-green"
                  >
                    Create New
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:block">
              {currentSignature && (
                <div className="rounded-md shadow-sm border dark:border-slate-700 glass-effect animate-slide-in">
                  <SignaturePreview signature={currentSignature} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-4 px-6 text-center bg-white dark:bg-slate-900 dark:border-slate-800 glass-effect">
        <p className="text-sm text-muted-foreground">
          Email Signature Generator &copy; {new Date().getFullYear()} | Made with ❤️ by Sanjukta Singha
        </p>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

export default Index;
