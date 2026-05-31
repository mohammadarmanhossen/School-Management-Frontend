"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, User, Settings } from "lucide-react";
import { useAuthStore, useNotificationStore, useUIStore } from "@/store";
import { authService } from "@/services";
import { getInitials } from "@/lib/utils";
import { ROLES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();
  const { user, logout, getRefreshToken } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { setMobileMenuOpen } = useUIStore();

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

  const notifPath =
    user?.role === "parent"
      ? "/parent/dashboard/notifications"
      : "/dashboard/notifications";

  const profilePath = "/dashboard/settings?tab=profile";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#050505]/80 px-4 backdrop-blur-xl md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-zinc-400 hover:bg-white/[0.04] hover:text-white lg:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search students, teachers..."
          className="h-9 border-white/[0.08] bg-white/[0.04] pl-9 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
        />
      </div>

      {/* Right-aligned actions */}
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative shrink-0 text-zinc-400 hover:bg-white/[0.04] hover:text-white"
          onClick={() => router.push(notifPath)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-0 bg-blue-500 p-0 text-[9px] text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] py-1.5 pl-1.5 pr-3 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-xs text-white">
                  {user ? getInitials(user.fullName) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-sm font-medium leading-tight text-zinc-200">
                  {user?.fullName}
                </p>
                <p className="truncate text-[11px] leading-tight text-zinc-500">
                  {user ? ROLES[user.role].label : ""}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 border-white/[0.08] bg-[#0a0a0a] p-0 text-zinc-200"
          >
            {/* Profile header in dropdown */}
            <div className="border-b border-white/[0.06] px-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-sm text-white">
                    {user ? getInitials(user.fullName) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{user?.fullName}</p>
                  <p className="truncate text-xs text-zinc-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-1">
              <DropdownMenuItem
                className="cursor-pointer gap-2 rounded-lg focus:bg-white/[0.06] focus:text-white"
                onClick={() => router.push(profilePath)}
              >
                <User className="h-4 w-4 text-zinc-400" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 rounded-lg focus:bg-white/[0.06] focus:text-white"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="h-4 w-4 text-zinc-400" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 rounded-lg focus:bg-white/[0.06] focus:text-white"
                onClick={() => router.push("/change-password")}
              >
                Change Password
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-white/[0.06]" />

            <div className="p-1">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer gap-2 rounded-lg text-red-400 focus:bg-red-500/10 focus:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
