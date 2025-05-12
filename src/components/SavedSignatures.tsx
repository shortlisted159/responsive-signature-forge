
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SignatureData, getSignatures, deleteSignature, saveSignature } from "@/lib/signatureStorage";
import { Edit, Trash2, Save, Plus } from "lucide-react";
import { templates } from "@/lib/templateData";
import { format } from "date-fns";

interface SavedSignaturesProps {
  currentSignature: SignatureData;
  onSignatureSelect: (signature: SignatureData) => void;
  onCreateNew: () => void;
}

export default function SavedSignatures({ currentSignature, onSignatureSelect, onCreateNew }: SavedSignaturesProps) {
  const [savedSignatures, setSavedSignatures] = useState<SignatureData[]>([]);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  
  useEffect(() => {
    setSavedSignatures(getSignatures());
  }, []);
  
  const handleSaveCurrent = () => {
    saveSignature(currentSignature);
    setSavedSignatures(getSignatures());
  };
  
  const handleRename = () => {
    if (!selectedSignatureId || !newName.trim()) return;
    
    const updatedSignature = savedSignatures.find(sig => sig.id === selectedSignatureId);
    if (!updatedSignature) return;
    
    const renamedSignature = {
      ...updatedSignature,
      name: newName.trim()
    };
    
    saveSignature(renamedSignature);
    setSavedSignatures(getSignatures());
    setIsRenameOpen(false);
    setNewName("");
    setSelectedSignatureId(null);
  };
  
  const handleDelete = () => {
    if (!selectedSignatureId) return;
    
    deleteSignature(selectedSignatureId);
    setSavedSignatures(getSignatures());
    setIsDeleteOpen(false);
    setSelectedSignatureId(null);
  };
  
  const openRenameDialog = (signature: SignatureData) => {
    setSelectedSignatureId(signature.id);
    setNewName(signature.name);
    setIsRenameOpen(true);
  };
  
  const openDeleteDialog = (signatureId: string) => {
    setSelectedSignatureId(signatureId);
    setIsDeleteOpen(true);
  };
  
  const getTemplateNameById = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : "Custom Template";
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Saved Signatures</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveCurrent}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              <span>{savedSignatures.some(s => s.id === currentSignature.id) ? 'Update Current' : 'Save Current'}</span>
            </Button>
            <Button 
              size="sm"
              onClick={onCreateNew}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>New</span>
            </Button>
          </div>
        </div>
        
        {savedSignatures.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground">No saved signatures yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Your signatures will be stored locally on this device.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {savedSignatures.map((signature) => {
              const isActive = signature.id === currentSignature.id;
              const lastModified = new Date(signature.dateModified);
              
              return (
                <Card 
                  key={signature.id} 
                  className={`border ${isActive ? 'border-brand-purple/50 bg-brand-light-purple/10' : ''}`}
                >
                  <CardContent className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{signature.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {getTemplateNameById(signature.templateId)} • Last edited {format(lastModified, "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => openRenameDialog(signature)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Rename</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(signature.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-3">
                    <Button 
                      variant={isActive ? "secondary" : "outline"} 
                      size="sm" 
                      className="w-full"
                      onClick={() => onSignatureSelect(signature)}
                      disabled={isActive}
                    >
                      {isActive ? "Currently Active" : "Load Signature"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Signature</DialogTitle>
            <DialogDescription>
              Enter a new name for your signature.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Signature name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This signature will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
