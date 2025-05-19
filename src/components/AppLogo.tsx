
import { Link } from "react-router-dom";
import { FileSignature } from "lucide-react";

interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="bg-brand-dark-green rounded-md p-1.5 transition-all hover:bg-brand-medium-green">
        <FileSignature className="h-5 w-5 text-white" />
      </div>
      <h1 className="text-lg font-bold">Email Signature Generator</h1>
    </Link>
  );
}
