
import { useState, useEffect, useRef } from "react";
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
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
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument || !iframe.contentWindow) {
        throw new Error("Preview iframe not accessible");
      }
      
      // Find the actual signature table in the iframe
      const signatureTable = iframe.contentDocument.querySelector('table');
      if (!signatureTable) {
        throw new Error("Signature table not found in preview");
      }
      
      // Create selection range for the table element
      const range = iframe.contentDocument.createRange();
      range.selectNode(signatureTable);
      
      const selection = iframe.contentWindow.getSelection();
      if (!selection) {
        throw new Error("Could not get selection from iframe");
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Try to copy using the iframe's document
      if (iframe.contentDocument.execCommand('copy')) {
        setIsCopying(true);
        toast.success("Signature copied to clipboard", {
          description: "The formatted signature has been copied and is ready to paste in your email"
        });
        setTimeout(() => setIsCopying(false), 2000);
      } else {
        throw new Error("Copy command failed");
      }
      
      // Clear selection
      selection.removeAllRanges();
      
    } catch (error) {
      console.error("Primary copy method failed:", error);
      
      // Fallback method - create a clean temporary iframe
      try {
        const tempIframe = document.createElement('iframe');
        tempIframe.style.position = 'fixed';
        tempIframe.style.left = '-9999px';
        tempIframe.style.top = '-9999px';
        tempIframe.style.width = '1px';
        tempIframe.style.height = '1px';
        tempIframe.setAttribute('sandbox', 'allow-same-origin');
        
        // Create clean HTML document with only the signature
        tempIframe.srcdoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
              </style>
            </head>
            <body>
              ${signatureHTML}
            </body>
          </html>
        `;
        
        document.body.appendChild(tempIframe);
        
        tempIframe.onload = () => {
          setTimeout(() => {
            try {
              if (!tempIframe.contentDocument || !tempIframe.contentWindow) {
                throw new Error("Temp iframe not accessible");
              }
              
              // Select the signature table from the clean iframe
              const tempTable = tempIframe.contentDocument.querySelector('table');
              if (!tempTable) {
                throw new Error("Table not found in temp iframe");
              }
              
              const tempRange = tempIframe.contentDocument.createRange();
              tempRange.selectNode(tempTable);
              
              const tempSelection = tempIframe.contentWindow.getSelection();
              if (!tempSelection) {
                throw new Error("Could not get selection from temp iframe");
              }
              
              tempSelection.removeAllRanges();
              tempSelection.addRange(tempRange);
              
              if (tempIframe.contentDocument.execCommand('copy')) {
                setIsCopying(true);
                toast.success("Signature copied to clipboard", {
                  description: "The formatted signature has been copied and is ready to paste in your email"
                });
                setTimeout(() => setIsCopying(false), 2000);
              } else {
                throw new Error("Fallback copy failed");
              }
              
            } catch (fallbackError) {
              console.error("Fallback copy failed:", fallbackError);
              toast.error("Could not copy signature", {
                description: "Try selecting the signature manually and copying with Ctrl+C"
              });
            } finally {
              document.body.removeChild(tempIframe);
            }
          }, 100);
        };
        
      } catch (fallbackError) {
        console.error("Could not create fallback iframe:", fallbackError);
        toast.error("Could not copy signature", {
          description: "Try selecting the signature manually and copying with Ctrl+C"
        });
      }
    }
  };

  // Create clean HTML document for iframe without wrapper divs
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
              padding: 0;
              background-color: white;
            }
          </style>
        </head>
        <body>
          ${signatureHTML}
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
                      ref={iframeRef}
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
                        <Copy className="h-4 w-4" /> Copy Signature
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="mt-4 text-sm border-t pt-4 dark:border-slate-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Click <strong>Copy Signature</strong> to copy the formatted signature</li>
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
          Copy the signature from the preview above for best email compatibility.
        </p>
      </div>
    </div>
  );
}
