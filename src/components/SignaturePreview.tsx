
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { SignatureData } from "@/lib/signatureStorage";
import { generateSignatureHTML } from "@/lib/signatureGenerator";
import { 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  Download, 
  Copy, 
  Check,
  Code, 
  Clipboard
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SignaturePreviewProps {
  signature: SignatureData;
}

export default function SignaturePreview({ signature }: SignaturePreviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCopying, setIsCopying] = useState<"html" | "content" | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [scaleAnimation, setScaleAnimation] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  const signatureHTML = generateSignatureHTML(signature);

  useEffect(() => {
    // Animation when signature updates
    setScaleAnimation(true);
    const timer = setTimeout(() => {
      setScaleAnimation(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [signatureHTML]);

  const handleDownloadHTML = () => {
    const blob = new Blob([signatureHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-signature.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Signature HTML file downloaded", {
      description: "You can now import this file into your email client"
    });
  };
  
  const handleCopyHTML = () => {
    navigator.clipboard.writeText(signatureHTML);
    setIsCopying("html");
    toast.success("HTML code copied to clipboard");
    setTimeout(() => setIsCopying(null), 2000);
  };

  const handleCopyContent = () => {
    // Create temporary container to extract plain text
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = signatureHTML;
    const plainText = tempContainer.textContent || '';
    
    navigator.clipboard.writeText(plainText);
    setIsCopying("content");
    toast.success("Signature text copied to clipboard");
    setTimeout(() => setIsCopying(null), 2000);
  };
  
  return (
    <div className="flex flex-col h-full border rounded-md">
      <div className="border-b p-3 flex justify-between items-center bg-white">
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

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownloadHTML}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download HTML</span>
          </Button>
        </div>
      </div>
      
      <div 
        className="flex flex-1 bg-slate-50 overflow-auto relative"
        onMouseEnter={() => setShowToolbar(true)}
        onMouseLeave={() => setShowToolbar(false)}
      >
        <div className={`flex flex-1 items-center justify-center p-8 ${viewMode === 'desktop' ? 'max-w-full' : 'max-w-[375px] mx-auto'}`}>
          <div 
            className={cn(
              "bg-white p-6 border shadow-sm rounded-md w-full transition-all duration-200",
              viewMode === 'mobile' ? 'max-w-[320px] scale-90' : 'max-w-full',
              scaleAnimation && "scale-[1.02] shadow-md"
            )}
          >
            <div 
              className="email-signature-preview"
              dangerouslySetInnerHTML={{ __html: signatureHTML }} 
            />
          </div>
        </div>
        
        {/* Floating toolbar */}
        <div 
          className={cn(
            "absolute right-4 top-4 flex flex-col gap-2 transition-opacity duration-200",
            showToolbar ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            size="sm"
            variant="secondary"
            className="h-9 w-9 p-0 rounded-full shadow-sm"
            onClick={handleCopyContent}
          >
            {isCopying === "content" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy Text</span>
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            className="h-9 w-9 p-0 rounded-full shadow-sm"
            onClick={handleCopyHTML}
          >
            {isCopying === "html" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Code className="h-4 w-4" />
            )}
            <span className="sr-only">Copy HTML</span>
          </Button>
        </div>
      </div>
      
      <div className="border-t p-3 flex justify-between items-center bg-white">
        <p className="text-xs text-muted-foreground">
          This is how your signature will appear in email clients that support HTML.
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopyContent}
            className="flex items-center gap-1"
          >
            {isCopying === "content" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Clipboard className="h-3.5 w-3.5" />
            )}
            <span>Copy Text</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopyHTML}
            className="flex items-center gap-1 hidden md:flex"
          >
            {isCopying === "html" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Code className="h-3.5 w-3.5" />
            )}
            <span>Copy HTML</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
