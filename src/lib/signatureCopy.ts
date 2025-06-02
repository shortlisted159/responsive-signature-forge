
import { toast } from "sonner";

export const copySignatureFromElement = async (element: HTMLTableElement): Promise<boolean> => {
  try {
    // Create a temporary container with clean styling
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = 'auto';
    tempContainer.style.height = 'auto';
    tempContainer.style.margin = '0';
    tempContainer.style.padding = '0';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Clone the signature table
    const clonedTable = element.cloneNode(true) as HTMLTableElement;
    tempContainer.appendChild(clonedTable);
    
    document.body.appendChild(tempContainer);
    
    // Create selection range for just the table
    const range = document.createRange();
    range.selectNodeContents(clonedTable);
    
    const selection = window.getSelection();
    if (!selection) {
      throw new Error("Could not get selection");
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Execute copy command
    const successful = document.execCommand('copy');
    
    // Clean up
    selection.removeAllRanges();
    document.body.removeChild(tempContainer);
    
    if (successful) {
      toast.success("Signature copied to clipboard", {
        description: "The formatted signature has been copied and is ready to paste in your email"
      });
      return true;
    } else {
      throw new Error("Copy command failed");
    }
    
  } catch (error) {
    console.error("Copy operation failed:", error);
    toast.error("Could not copy signature", {
      description: "Try selecting the signature manually and copying with Ctrl+C"
    });
    return false;
  }
};

export const copySignatureFromIframe = async (iframeRef: React.RefObject<HTMLIFrameElement>): Promise<boolean> => {
  try {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument || !iframe.contentWindow) {
      throw new Error("Preview iframe not accessible");
    }
    
    // Find the signature table in the iframe
    const signatureTable = iframe.contentDocument.querySelector('table');
    if (!signatureTable) {
      throw new Error("Signature table not found in preview");
    }
    
    return await copySignatureFromElement(signatureTable);
    
  } catch (error) {
    console.error("Iframe copy failed:", error);
    toast.error("Could not copy signature", {
      description: "Try using the Download HTML option instead"
    });
    return false;
  }
};
