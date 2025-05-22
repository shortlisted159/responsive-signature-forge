
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
      // Get the iframe element where the preview is rendered
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument) {
        throw new Error("Preview iframe not found");
      }
      
      // Select ONLY the signature content inside the iframe, not the wrapper div
      const signatureElement = iframe.contentDocument.querySelector('.signature-wrapper > div');
      if (!signatureElement) {
        throw new Error("Signature element not found in preview");
      }
      
      // Create a selection range and select only the signature content
      const selection = iframe.contentWindow?.getSelection();
      const range = iframe.contentDocument.createRange();
      range.selectNode(signatureElement);
      
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Try to use the newer clipboard API first
        if (iframe.contentDocument.execCommand('copy')) {
          setIsCopying(true);
          toast.success("Signature copied to clipboard", {
            description: "The formatted signature has been copied and is ready to paste in Gmail"
          });
          setTimeout(() => setIsCopying(false), 2000);
        } else {
          throw new Error("Copy operation failed");
        }
        
        // Clear selection after copying
        selection.removeAllRanges();
      } else {
        throw new Error("Could not get selection from iframe");
      }
    } catch (error) {
      console.error("Error copying signature:", error);
      
      // Fallback method if the primary method fails
      try {
        // Create a temporary hidden iframe with ONLY the signature content
        const tempIframe = document.createElement('iframe');
        tempIframe.srcdoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Email Signature Preview</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
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
        tempIframe.style.position = 'fixed';
        tempIframe.style.left = '-9999px';
        tempIframe.style.top = '-9999px';
        tempIframe.width = '500';
        tempIframe.height = '500';
        // Fixed: Use setAttribute instead of direct assignment for sandbox
        tempIframe.setAttribute('sandbox', 'allow-same-origin');
        
        // Add the iframe to the document
        document.body.appendChild(tempIframe);
        
        tempIframe.onload = () => {
          setTimeout(() => {
            try {
              // Focus the iframe to make sure copy works
              tempIframe.contentWindow?.focus();
              
              // Select the direct signature content in the iframe (without wrapper)
              const tempDoc = tempIframe.contentDocument;
              if (tempDoc) {
                const contentBody = tempDoc.body.firstElementChild;
                if (contentBody) {
                  const tempRange = tempDoc.createRange();
                  tempRange.selectNode(contentBody);
                  
                  const tempSelection = tempIframe.contentWindow?.getSelection();
                  if (tempSelection) {
                    tempSelection.removeAllRanges();
                    tempSelection.addRange(tempRange);
                    
                    // Execute copy command
                    const success = tempDoc.execCommand('copy');
                    
                    if (success) {
                      setIsCopying(true);
                      toast.success("Signature copied to clipboard", {
                        description: "The formatted signature has been copied and is ready to paste in Gmail"
                      });
                      setTimeout(() => setIsCopying(false), 2000);
                    } else {
                      throw new Error("Copy command failed in fallback");
                    }
                  }
                }
              }
            } catch (innerError) {
              console.error("Fallback copy failed:", innerError);
              toast.error("Could not copy signature", {
                description: "Try selecting all content in the preview and copying manually"
              });
            } finally {
              // Clean up by removing the temporary iframe
              document.body.removeChild(tempIframe);
            }
          }, 100);
        };
        
      } catch (fallbackError) {
        toast.error("Could not copy signature", {
          description: "Try selecting all content in the preview and copying manually"
        });
      }
    }
  };

  // Create a full HTML document for the iframe - modified to avoid nested wrappers
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
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 border rounded-md p-4 dark:border-slate-700">
        <h2 className="text-lg font-medium mb-4">Live HTML Preview Method</h2>
        <div className="text-sm mb-2">
          This preview shows exactly how your signature will appear in Gmail. Copy directly from the preview window for best results.
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
                    <Copy className="h-3.5 w-3.5" /> Copy from Preview
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
                onLoad={() => {
                  // Focus the iframe after it loads to ensure copy operations work
                  iframeRef.current?.contentWindow?.focus();
                }}
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm">
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click <strong>Copy from Preview</strong> to copy the formatted signature</li>
            <li>Go to <a href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Gmail Settings</a></li>
            <li>In the Signature section, click in the editor and paste (Ctrl+V or Cmd+V)</li>
            <li>Save Changes at the bottom of the page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
