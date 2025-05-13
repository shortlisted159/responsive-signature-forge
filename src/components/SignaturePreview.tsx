
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
  Mail,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  // Make sure HTML is Gmail safe
  const getGmailSafeHTML = () => {
    // Replace relative URLs with absolute ones
    // Add !important to all style declarations
    // Ensure all colors are specified with full hex codes
    // Make all styles inline
    let safeHTML = signatureHTML;
    
    // Convert any CSS variables to their actual values
    safeHTML = safeHTML.replace(/var\(--[^)]+\)/g, (match) => {
      // In a production app, you would extract the actual color value here
      return "#6E59A5"; // Replace with actual color value
    });
    
    // Force important on style attributes
    safeHTML = safeHTML.replace(/style="([^"]+)"/g, (match, styles) => {
      const importantStyles = styles
        .split(';')
        .filter(style => style.trim())
        .map(style => {
          if (!style.includes('!important')) {
            return `${style.trim()} !important`;
          }
          return style.trim();
        })
        .join('; ');
      
      return `style="${importantStyles}"`;
    });
    
    return safeHTML;
  };

  useEffect(() => {
    // Animation when signature updates
    setScaleAnimation(true);
    const timer = setTimeout(() => {
      setScaleAnimation(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [signatureHTML]);

  const handleDownloadHTML = () => {
    const blob = new Blob([getGmailSafeHTML()], { type: 'text/html' });
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
    navigator.clipboard.writeText(getGmailSafeHTML());
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
    { id: "gmail", name: "Gmail", icon: "gmail.svg", url: "https://mail.google.com/mail/u/0/#settings/general" },
    { id: "outlook", name: "Outlook", icon: "outlook.svg", url: "https://outlook.live.com/mail/0/options/mail/layout" },
    { id: "apple", name: "Apple Mail", icon: "apple.svg", url: "https://support.apple.com/guide/mail/create-a-signature-mlhlp1208/mac" },
    { id: "yahoo", name: "Yahoo Mail", icon: "yahoo.svg", url: "https://mail.yahoo.com/d/settings/1" },
    { id: "thunderbird", name: "Thunderbird", icon: "thunderbird.svg", url: "https://support.mozilla.org/en-US/kb/signatures" },
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

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Export Options</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0" align="end">
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyHTML}
                  className="h-9 justify-start px-3"
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  <span>Copy HTML Code</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyContent}
                  className="h-9 justify-start px-3"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  <span>Copy Plain Text</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadHTML}
                  className="h-9 justify-start px-3"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span>Download HTML</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
                {getGmailSafeHTML()}
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
              <a
                key={provider.id}
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="h-auto flex-col py-4 w-full"
                >
                  <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-full mb-2 flex items-center justify-center">
                    <span className="text-xs uppercase font-bold">{provider.name[0]}</span>
                  </div>
                  <span className="text-xs flex items-center">
                    {provider.name}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </span>
                </Button>
              </a>
            ))}
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-md border dark:border-slate-700">
            <h3 className="text-sm font-medium mb-2">Installation Instructions:</h3>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4">
              <li>Copy your signature HTML code using the "Copy HTML" button</li>
              <li>Open your email client's settings or preferences (links above)</li>
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
      
      <div className="border-t p-2 text-center text-xs text-muted-foreground bg-white dark:bg-slate-900 dark:border-slate-700">
        Made with ❤️ by Sanjukta Singha
      </div>
    </div>
  );
}
