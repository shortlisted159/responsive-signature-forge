
import { Button } from "@/components/ui/button";
import { SignatureData } from "@/lib/signatureStorage";
import { generateSignatureHTML } from "@/lib/signatureGenerator";
import { useState } from "react";
import { 
  Download, 
  Copy, 
  Check,
  FileCode,
  Mail
} from "lucide-react";
import { toast } from "sonner";

interface ExportOptionsProps {
  signature: SignatureData;
}

export default function ExportOptions({ signature }: ExportOptionsProps) {
  const [isCopying, setIsCopying] = useState<"html" | "content" | null>(null);
  
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

  const providers = [
    { id: "gmail", name: "Gmail", icon: "gmail.svg" },
    { id: "outlook", name: "Outlook", icon: "outlook.svg" },
    { id: "apple", name: "Apple Mail", icon: "apple.svg" },
    { id: "yahoo", name: "Yahoo Mail", icon: "yahoo.svg" },
    { id: "thunderbird", name: "Thunderbird", icon: "thunderbird.svg" },
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border rounded-md p-4 dark:border-slate-700">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-medium">Copy or Download HTML</h3>
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
      
      <div className="space-y-4">
        <h3 className="font-medium">Add to Email Client</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-md border dark:border-slate-700">
        <h3 className="text-sm font-medium mb-2">Installation Instructions:</h3>
        <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4">
          <li>Copy your signature HTML code using the "Copy HTML" button above</li>
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
