// components/AuthButton.tsx
import { useAuthContext } from "@/contexts/AuthContext";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

export const AuthButton = () => {
  const { user, isAuthenticated, logout: contextLogout } = useAuthContext();
  const [, setLocation] = useLocation();
  const logoutMutation = useLogout();
  const { toast } = useToast();

  // Extract first name only
  const firstName = user?.name.split(" ")[0] || "User";

  const handleLogout = () => {
    if (!user?.token) {
      contextLogout();
      localStorage.removeItem("shopping_cart");
      setLocation("/login");
      return;
    }

    logoutMutation.mutate(
      { token: user.token },
      {
        onSuccess: (message) => {
          contextLogout();
          localStorage.removeItem("shopping_cart");
          toast({
            title: "Logged out",
            description: message,
            duration: 3000,
          });
          setLocation("/login");
        },
        onError: () => {
          contextLogout();
          localStorage.removeItem("shopping_cart");
          toast({
            title: "Logged out",
            description: "You have been logged out",
            duration: 3000,
          });
          setLocation("/login");
        },
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => setLocation("/login")}
        variant="outline"
        className="gap-2 rounded-full border-primary/40 hover:bg-primary/5 hover:border-primary"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Login</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setLocation("/profile")}
        variant="outline"
        className="gap-2 rounded-full border-primary/40 hover:bg-primary/5 hover:border-primary"
      >
        <User className="h-4 w-4" />
        {firstName}
      </Button>
      <Button
        onClick={handleLogout}
        variant="outline"
        disabled={logoutMutation.isPending}
        className="gap-2 rounded-full border-primary/40 hover:bg-primary/5 hover:border-primary"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
      </Button>
    </div>
  );
};
