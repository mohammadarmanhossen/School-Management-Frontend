"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore, useNotificationStore, useUIStore } from "@/store";
import { authService } from "@/services";
import { getInitials } from "@/lib/utils";
import { ROLES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout, getRefreshToken } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { sidebarCollapsed, setMobileMenuOpen } = useUIStore();

  const handleLogout = async () => {
    try {
      const refresh = getRefreshToken();
      if (refresh) await authService.logout(refresh);
    } catch {
      // proceed with local logout
    } finally {
      logout();
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl md:px-6"
      style={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/dashboard/notifications")}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
            {unreadCount}
          </Badge>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user ? getInitials(user.fullName) : "U"}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {user ? ROLES[user.role].label : ""}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/change-password")}>
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
