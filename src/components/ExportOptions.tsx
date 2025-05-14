
import { Button } from "@/components/ui/button";
import { SignatureData } from "@/lib/signatureStorage";
import { generateSignatureHTML } from "@/lib/signatureGenerator";
import { useState, useRef } from "react";
import { 
  Download, 
  Copy, 
  Check,
  FileCode,
  Mail,
  Info,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ExportOptionsProps {
  signature: SignatureData;
}

export default function ExportOptions({ signature }: ExportOptionsProps) {
  const [isCopying, setIsCopying] = useState<"html" | "content" | "gmail" | null>(null);
  const clipboardDivRef = useRef<HTMLDivElement>(null);
  
  const signatureHTML = generateSignatureHTML(signature);

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

  // New function specifically for Gmail-compatible copy using execCommand
  const handleCopyForGmail = () => {
    if (!clipboardDivRef.current) return;
    
    try {
      // Insert the HTML into the hidden div
      clipboardDivRef.current.innerHTML = signatureHTML;
      
      // Select the content
      const range = document.createRange();
      range.selectNodeContents(clipboardDivRef.current);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Execute the copy command
        document.execCommand('copy');
        selection.removeAllRanges();
        
        setIsCopying("gmail");
        toast.success("Gmail-ready signature copied to clipboard", {
          description: "Now paste directly into Gmail's signature editor"
        });
        setTimeout(() => setIsCopying(null), 2000);
      }
    } catch (error) {
      console.error("Error copying for Gmail:", error);
      toast.error("Failed to copy signature for Gmail");
      
      // Fallback to the regular clipboard API
      navigator.clipboard.writeText(signatureHTML);
    }
  };

  const providers = [
    { id: "gmail", name: "Gmail", icon: "gmail.svg", url: "https://mail.google.com/mail/u/0/#settings/general" },
    { id: "outlook", name: "Outlook", icon: "outlook.svg", url: "https://outlook.live.com/mail/0/options/mail/layout" },
    { id: "apple", name: "Apple Mail", icon: "apple.svg", url: "https://support.apple.com/guide/mail/create-a-signature-mlhlp1208/mac" },
    { id: "yahoo", name: "Yahoo Mail", icon: "yahoo.svg", url: "https://mail.yahoo.com/d/settings/1" },
    { id: "thunderbird", name: "Thunderbird", icon: "thunderbird.svg", url: "https://support.mozilla.org/en-US/kb/signatures" },
  ];
  
  return (
    <div className="space-y-6">
      {/* Hidden div for clipboard operations */}
      <div 
        ref={clipboardDivRef} 
        contentEditable="true"
        suppressContentEditableWarning={true}
        className="fixed opacity-0 pointer-events-none overflow-hidden"
        style={{ top: '-9999px', left: '-9999px', height: '1px', width: '1px' }}
      ></div>
      
      <div className="bg-white dark:bg-slate-900 border rounded-md p-4 dark:border-slate-700">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-medium flex items-center gap-2">
            Copy or Download HTML
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                  <Info className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p>For rich text formatting, use "Copy for Gmail" option and paste directly into Gmail's signature editor.</p>
              </TooltipContent>
            </Tooltip>
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyHTML}
              className="h-8 gap-1"
            >
              {isCopying === "html" ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy HTML
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadHTML}
              className="h-8 gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </Button>
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 dark:border-slate-700 p-3 rounded border text-xs font-mono h-32 overflow-y-auto">
          <code className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
            {signatureHTML}
          </code>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 border rounded-md p-4 dark:border-slate-700">
        <h3 className="font-medium mb-3">Gmail-specific Export</h3>
        <div className="flex flex-col space-y-4">
          <div className="flex gap-3 items-center">
            <Button
              variant="default"
              size="sm"
              onClick={handleCopyForGmail}
              className="h-9 gap-1"
            >
              {isCopying === "gmail" ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" /> Copy for Gmail
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">This option is optimized for Gmail's signature editor.</p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-fit">
                <Info className="h-4 w-4 mr-2" />
                Gmail Instructions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>How to add your signature to Gmail</AlertDialogTitle>
                <AlertDialogDescription>
                  <ol className="list-decimal pl-5 space-y-2 mb-4">
                    <li>Click "Copy for Gmail" above</li>
                    <li>Go to Gmail Settings (⚙️ icon) → See all settings</li>
                    <li>Scroll down to the "Signature" section</li>
                    <li>Create a new signature or edit an existing one</li>
                    <li>Click in the signature editor field</li>
                    <li>Press Ctrl+V (or Cmd+V on Mac) to paste your signature</li>
                    <li>Scroll down and click "Save Changes"</li>
                  </ol>
                  <div className="text-sm font-medium mb-1">Important Notes:</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Do <strong>not</strong> use the plain text "Copy Content" option for Gmail</li>
                    <li>Images may need to be uploaded separately in Gmail</li>
                    <li>Some formatting might need minor adjustments after pasting</li>
                    <li>If formatting is lost, try using a different browser (Chrome works best)</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <a 
                    href="https://mail.google.com/mail/u/0/#settings/general" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                  >
                    Open Gmail Settings
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Add to Email Client</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="outline"
              className="h-auto flex-col py-4"
              asChild
            >
              <a href={provider.url} target="_blank" rel="noopener noreferrer">
                <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-full mb-2 flex items-center justify-center">
                  <span className="text-xs uppercase font-bold">{provider.name[0]}</span>
                </div>
                <span className="text-xs flex items-center">
                  {provider.name}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </span>
              </a>
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-md border dark:border-slate-700">
        <h3 className="text-sm font-medium mb-2">Installation Instructions:</h3>
        <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4">
          <li>Copy your signature HTML code using the appropriate button above</li>
          <li>Open your email client's settings or preferences</li>
          <li>Navigate to the Signature section</li>
          <li>Create a new signature or edit an existing one</li>
          <li>Paste your HTML code (using Ctrl+V or Cmd+V)</li>
          <li>Save your changes</li>
        </ol>
      </div>
    </div>
  );
}
