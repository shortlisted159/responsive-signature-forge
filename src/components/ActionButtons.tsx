
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ActionButtonsProps {
  onCreateNew: () => void;
  onToggleSavedView: () => void;
  showingSavedView: boolean;
}

export default function ActionButtons({ 
  onCreateNew, 
  onToggleSavedView, 
  showingSavedView 
}: ActionButtonsProps) {
  const { toast } = useToast();

  const handleCreateNew = () => {
    onCreateNew();
    toast({
      title: "Creating new signature",
      description: "Choose a template for your new signature",
      duration: 2000,
    });
  };
  
  const handleToggleView = () => {
    onToggleSavedView();
    toast({
      title: showingSavedView ? "Editing signature" : "Viewing saved signatures",
      description: showingSavedView ? "You're back to editing your signature" : "Browse your saved signatures",
      duration: 1500,
    });
  };

  return (
    <div className="flex justify-between border-t p-3 bg-muted/30 dark:bg-slate-800/50 glass-effect">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleToggleView}
        className="interactive-element hover:bg-brand-light-green hover:text-brand-dark-green"
      >
        {showingSavedView ? "Back to Editor" : "Saved Signatures"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleCreateNew}
        className="interactive-element hover:bg-brand-light-green hover:text-brand-dark-green"
      >
        Create New
      </Button>
    </div>
  );
}
