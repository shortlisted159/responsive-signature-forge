
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignatureData } from "@/lib/signatureStorage";
import { generateSignatureHTML } from "@/lib/signatureGenerator";
import { Copy, Check, FileCode, Mail } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ExportOptionsProps {
  signature: SignatureData;
}

export default function ExportOptions({ signature }: ExportOptionsProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const html = generateSignatureHTML(signature);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    toast.success("HTML code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const providers = [
    { id: "gmail", name: "Gmail", icon: "gmail.svg" },
    { id: "outlook", name: "Outlook", icon: "outlook.svg" },
    { id: "apple", name: "Apple Mail", icon: "apple.svg" },
    { id: "yahoo", name: "Yahoo Mail", icon: "yahoo.svg" },
    { id: "thunderbird", name: "Thunderbird", icon: "thunderbird.svg" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Export Your Signature</h2>

      <Tabs defaultValue="code" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="code" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" /> HTML Code
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email Clients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="space-y-4 mt-4">
          <div className="bg-slate-50 border rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500">HTML Code</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="h-7 gap-1"
              >
                {copied ? (
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
            <div className="bg-slate-100 p-3 rounded text-xs font-mono h-32 overflow-y-auto">
              <code className="text-slate-700 whitespace-pre-wrap break-all">
                {html}
              </code>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Copy this code and paste it into your email client's signature settings.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {providers.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className="h-auto flex-col py-4"
              >
                <div className="h-8 w-8 bg-slate-100 rounded-full mb-2"></div>
                <span className="text-xs">{provider.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="bg-muted/50 p-4 rounded-md mt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
