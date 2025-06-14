
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Gauge, Calendar, Sparkles, CalendarDays } from "lucide-react";

export default function PremiumFeatures() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium">Additional Features</h2>
        <p className="text-sm text-muted-foreground">
          These powerful features are available for your email signatures
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Gauge className="h-4 w-4" /> Click Tracking
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Monitor engagement with your signature links
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Track when recipients click your social media icons, website links, or call-to-action buttons.</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              Enable Tracking
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Meeting Scheduler
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Let contacts book time with you directly
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Integrate your Calendly, Acuity, or other scheduling tools to let recipients book meetings directly.</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              Add Scheduler
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Seasonal Variations
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Automatic signature changes based on dates
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Create holiday-themed signatures or promotional variations that automatically activate during specific date ranges.</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              Create Variation
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Conditional Content
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Show different content based on conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Display different messages or calls-to-action based on recipient, time of day, device, or other conditions.</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              Set Conditions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
