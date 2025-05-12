
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { SignatureData } from "@/lib/signatureStorage";
import { generateSignatureHTML } from "@/lib/signatureGenerator";
import { Smartphone, Monitor, RefreshCw } from "lucide-react";

interface SignaturePreviewProps {
  signature: SignatureData;
}

export default function SignaturePreview({ signature }: SignaturePreviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  const signatureHTML = generateSignatureHTML(signature);
  
  return (
    <div className="flex flex-col h-full border rounded-md">
      <div className="border-b p-3 flex justify-between items-center">
        <h2 className="text-lg font-medium">Preview</h2>
        <div className="flex items-center gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "desktop" | "mobile")}
            className="w-auto"
          >
            <TabsList className="h-8 p-0.5">
              <TabsTrigger value="desktop" className="h-7 px-2.5">
                <Monitor className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Desktop</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="h-7 px-2.5">
                <Smartphone className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Mobile</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            className={`h-8 w-8 p-0 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh Preview</span>
          </Button>
        </div>
      </div>
      
      <div className={`flex flex-1 items-center justify-center p-8 ${viewMode === 'desktop' ? 'max-w-full' : 'max-w-[375px] mx-auto'}`}>
        <div 
          className={`${viewMode === 'mobile' ? 'max-w-[320px] scale-90' : 'max-w-full'} 
            bg-white p-6 border shadow-sm rounded-md w-full transition-all duration-200`}
        >
          <div 
            className="email-signature-preview"
            dangerouslySetInnerHTML={{ __html: signatureHTML }} 
          />
        </div>
      </div>
      
      <div className="border-t p-3 text-center bg-muted/30">
        <p className="text-xs text-muted-foreground">
          This is how your signature will appear in email clients that support HTML.
        </p>
      </div>
    </div>
  );
}
