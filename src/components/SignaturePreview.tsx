
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
  Copy, 
  Check,
  Code, 
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
  const [isCopying, setIsCopying] = useState(false);
  const [scaleAnimation, setScaleAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const { theme } = useTheme();
  
  const [signatureHTML, setSignatureHTML] = useState("");
  
  useEffect(() => {
    // Generate HTML whenever signature changes
    const html = generateSignatureHTML(signature);
    setSignatureHTML(html);
    
    // Animation when signature updates
    setScaleAnimation(true);
    const timer = setTimeout(() => {
      setScaleAnimation(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [signature]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCopyFromIframe = async () => {
    try {
      // Use the Clipboard API to copy the HTML content directly
      await navigator.clipboard.writeText(signatureHTML);
      
      setIsCopying(true);
      toast.success("Signature copied to clipboard", {
        description: "The formatted signature has been copied and is ready to paste in Gmail"
      });
      setTimeout(() => setIsCopying(false), 2000);
    } catch (error) {
      console.error("Error copying signature:", error);
      
      // Fallback method using selection if Clipboard API fails
      try {
        const iframe = document.getElementById('signature-preview-iframe') as HTMLIFrameElement;
        if (!iframe || !iframe.contentDocument) {
          throw new Error("Preview iframe not found");
        }

        // Clear any existing selection first
        if (iframe.contentWindow?.getSelection()) {
          iframe.contentWindow.getSelection()?.removeAllRanges();
        }
        
        // Create a new range and select just the signature element
        const range = iframe.contentDocument.createRange();
        const signatureElement = iframe.contentDocument.querySelector('.signature-wrapper');
        
        if (!signatureElement) {
          throw new Error("Signature element not found in preview");
        }
        
        range.selectNode(signatureElement);
        
        // Apply the selection
        const selection = iframe.contentWindow?.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        // Copy the selected content
        const success = iframe.contentDocument.execCommand('copy');
        
        if (!success) {
          throw new Error("Copy operation failed");
        }
        
        setIsCopying(true);
        toast.success("Signature copied to clipboard", {
          description: "The formatted signature has been copied and is ready to paste in Gmail"
        });
        setTimeout(() => setIsCopying(false), 2000);
      } catch (fallbackError) {
        toast.error("Could not copy signature", {
          description: "Try selecting all content in the preview and copying manually"
        });
      }
    }
  };

  // Create a full HTML document for the iframe
  const getFullHtmlDocument = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Email Signature Preview</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: white;
            }
          </style>
        </head>
        <body>
          <div class="signature-wrapper">
            ${signatureHTML}
          </div>
        </body>
      </html>
    `;
  };
  
  return (
    <div className="flex flex-col h-full border rounded-md dark:border-slate-700">
      <div className="border-b p-3 flex justify-between items-center bg-white dark:bg-slate-900 dark:border-slate-700">
        <h2 className="text-lg font-medium">Live Preview</h2>
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
      
      <div className="flex-1 bg-slate-50 dark:bg-slate-800 overflow-auto">
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "code")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>HTML Code</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border rounded-md p-4 dark:border-slate-700">
                <div className={`flex justify-center p-4 ${viewMode === 'desktop' ? 'max-w-full' : 'max-w-[375px] mx-auto'}`}>
                  <div 
                    className={cn(
                      "bg-white dark:bg-slate-950 p-6 border shadow-sm rounded-md w-full transition-all duration-200 dark:border-slate-700",
                      viewMode === 'mobile' ? 'max-w-[320px] scale-90' : 'max-w-full',
                      scaleAnimation && "scale-[1.02] shadow-md"
                    )}
                  >
                    <iframe
                      id="signature-preview-iframe"
                      srcDoc={getFullHtmlDocument()}
                      title="Signature Preview"
                      className="w-full min-h-[200px] border-none bg-white"
                      sandbox="allow-same-origin"
                    ></iframe>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleCopyFromIframe}
                    className="h-9 px-4 gap-1"
                    disabled={isCopying}
                  >
                    {isCopying ? (
                      <>
                        <Check className="h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy from Preview
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="mt-4 text-sm border-t pt-4 dark:border-slate-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Click <strong>Copy from Preview</strong> to copy the formatted signature</li>
                    <li>Go to your email client's signature settings</li>
                    <li>Click in the signature editor and paste (Ctrl+V or Cmd+V)</li>
                    <li>Save your changes</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border rounded-md p-4 dark:border-slate-700">
                <div className="bg-slate-100 dark:bg-slate-800 dark:border-slate-700 p-3 rounded border text-xs font-mono h-[300px] overflow-y-auto">
                  <code className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                    {signatureHTML}
                  </code>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="border-t p-3 flex justify-between items-center bg-white dark:bg-slate-900 dark:border-slate-700">
        <p className="text-xs text-muted-foreground">
          Toggle between preview and code view. Copy directly from the preview for best results.
        </p>
      </div>
    </div>
  );
}
