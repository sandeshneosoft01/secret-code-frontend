"use client";
import { useStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const getInitialName = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join('');
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const UserProfile = () => {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);

  return (
    <div className="absolute right-0 top-0 z-100 p-3 flex gap-2 items-center">
      <ThemeToggle />
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-8.5 h-8.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200">
              <AvatarImage src={user.user.photoURL} />
              <AvatarFallback>{getInitialName(user.user.fullName)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.user.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default UserProfile;
