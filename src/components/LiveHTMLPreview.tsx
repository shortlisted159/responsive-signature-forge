
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SignatureData } from "@/lib/signatureStorage";
import { generateSignatureHTML } from "@/lib/signatureGenerator";
import { Copy, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface LiveHTMLPreviewProps {
  signature: SignatureData;
}

export default function LiveHTMLPreview({ signature }: LiveHTMLPreviewProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [signatureHTML, setSignatureHTML] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    // Generate HTML whenever signature changes
    const html = generateSignatureHTML(signature);
    setSignatureHTML(html);
  }, [signature]);

  const handleCopyFromIframe = async () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument || !iframe.contentWindow) {
        throw new Error("Preview iframe not accessible");
      }
      
      // Find the actual signature table in the iframe (not any wrapper)
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
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 border rounded-md p-4 dark:border-slate-700">
        <h2 className="text-lg font-medium mb-4">Live HTML Preview Method</h2>
        <div className="text-sm mb-2">
          This preview shows exactly how your signature will appear in your email. Copy directly from the preview for best results.
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* HTML Code */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">HTML Code</h3>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 dark:border-slate-700 p-3 rounded border text-xs font-mono h-60 overflow-y-auto">
              <code className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                {signatureHTML}
              </code>
            </div>
          </div>
          
          {/* Live Preview */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Rendered Preview</h3>
              <Button
                variant="default"
                size="sm"
                onClick={handleCopyFromIframe}
                className="h-7 gap-1"
                disabled={isCopying}
              >
                {isCopying ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Signature
                  </>
                )}
              </Button>
            </div>
            <div className="bg-white border rounded h-60 overflow-hidden">
              <iframe
                ref={iframeRef}
                id="signature-preview-iframe"
                srcDoc={getFullHtmlDocument()}
                title="Signature Preview"
                className="w-full h-full"
                sandbox="allow-same-origin"
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm">
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click <strong>Copy Signature</strong> to copy the formatted signature</li>
            <li>Go to <a href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Gmail Settings</a></li>
            <li>In the Signature section, click in the editor and paste (Ctrl+V or Cmd+V)</li>
            <li>Save Changes at the bottom of the page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
