
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import AdPirateLogo from "@/components/AdPirateLogo";

const Navbar = () => {
  const { user, signOut } = useAuth();
  
  return (
    <header className="p-4 sm:p-6 sticky top-0 z-10 backdrop-blur bg-background/80 border-b border-white/10">
      <div className="container max-w-7xl flex justify-between items-center">
        <Link to="/">
          <AdPirateLogo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Pricing
          </Link>
          <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Contact
          </Link>
          <Link to="/discord" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Discord
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0" size="icon">
                  <Avatar>
                    <AvatarFallback className="bg-purple-600 text-primary-foreground">
                      {user.email ? user.email[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border border-white/10">
                <DropdownMenuItem disabled className="opacity-70">
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.email || "OpenAI User"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden md:flex">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild className="purple-gradient-bg hover:opacity-90 border-none">
                <Link to="/auth?action=signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
