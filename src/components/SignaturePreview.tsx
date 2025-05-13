
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
  Clipboard,
  FileCode,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface SignaturePreviewProps {
  signature: SignatureData;
}

export default function SignaturePreview({ signature }: SignaturePreviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCopying, setIsCopying] = useState<"html" | "content" | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [scaleAnimation, setScaleAnimation] = useState(false);
  const [exportView, setExportView] = useState<"preview" | "code" | "guides">("preview");
  const { theme } = useTheme();
  
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

  const providers = [
    { id: "gmail", name: "Gmail", icon: "gmail.svg" },
    { id: "outlook", name: "Outlook", icon: "outlook.svg" },
    { id: "apple", name: "Apple Mail", icon: "apple.svg" },
    { id: "yahoo", name: "Yahoo Mail", icon: "yahoo.svg" },
    { id: "thunderbird", name: "Thunderbird", icon: "thunderbird.svg" },
  ];
  
  return (
    <div className="flex flex-col h-full border rounded-md dark:border-slate-700">
      <div className="border-b p-3 flex justify-between items-center bg-white dark:bg-slate-900 dark:border-slate-700">
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
      
      {exportView === "preview" && (
        <div 
          className="flex flex-1 bg-slate-50 dark:bg-slate-800 overflow-auto relative"
          onMouseEnter={() => setShowToolbar(true)}
          onMouseLeave={() => setShowToolbar(false)}
        >
          <div className={`flex flex-1 items-center justify-center p-8 ${viewMode === 'desktop' ? 'max-w-full' : 'max-w-[375px] mx-auto'}`}>
            <div 
              className={cn(
                "bg-white dark:bg-slate-900 p-6 border shadow-sm rounded-md w-full transition-all duration-200 dark:border-slate-700",
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
              title="Copy Text Content"
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
              title="Copy HTML Code"
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
      )}

      {exportView === "code" && (
        <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 overflow-auto">
          <div className="bg-white dark:bg-slate-900 border rounded-md p-4 dark:border-slate-700">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">HTML Code</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyHTML}
                className="h-7 gap-1"
              >
                {isCopying === "html" ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Code
                  </>
                )}
              </Button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 dark:border-slate-700 p-3 rounded border text-xs font-mono h-48 overflow-y-auto">
              <code className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                {signatureHTML}
              </code>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Copy this code and paste it into your email client's signature settings.
            </p>
          </div>
        </div>
      )}

      {exportView === "guides" && (
        <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {providers.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className="h-auto flex-col py-4"
              >
                <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-full mb-2"></div>
                <span className="text-xs">{provider.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-md border dark:border-slate-700">
            <h3 className="text-sm font-medium mb-2">Installation Instructions:</h3>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4">
              <li>Copy your signature HTML code from the "HTML Code" tab</li>
              <li>Open your email client's settings or preferences</li>
              <li>Navigate to the Signature section</li>
              <li>Create a new signature or edit an existing one</li>
              <li>Paste your HTML code (using Ctrl+V or Cmd+V)</li>
              <li>Save your changes</li>
            </ol>
          </div>
        </div>
      )}
      
      <div className="border-t p-3 flex justify-between items-center bg-white dark:bg-slate-900 dark:border-slate-700">
        <p className="text-xs text-muted-foreground">
          This is how your signature will appear in email clients that support HTML.
        </p>
        <div className="flex gap-2">
          <Button 
            variant={exportView === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setExportView("preview")}
            className="flex items-center gap-1"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Preview</span>
          </Button>

          <Button 
            variant={exportView === "code" ? "default" : "outline"}
            size="sm"
            onClick={() => setExportView("code")}
            className="flex items-center gap-1"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>HTML</span>
          </Button>
          
          <Button 
            variant={exportView === "guides" ? "default" : "outline"}
            size="sm"
            onClick={() => setExportView("guides")}
            className="flex items-center gap-1 hidden md:flex"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Guides</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
