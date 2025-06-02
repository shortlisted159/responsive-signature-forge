
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SignatureData } from "@/lib/signatureStorage";
import { generateSignatureHTML } from "@/lib/signatureGenerator";
import { Copy, Check, ArrowRight } from "lucide-react";
import { copySignatureFromIframe } from "@/lib/signatureCopy";

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
    setIsCopying(true);
    const success = await copySignatureFromIframe(iframeRef);
    setTimeout(() => setIsCopying(false), 2000);
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
              margin: 0;
              padding: 20px;
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
