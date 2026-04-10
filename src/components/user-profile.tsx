"use client";
import { useStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const getInitialName = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join('');
}

import { ThemeToggle } from "./theme-toggle";

const UserProfile = () => {
  const user = useStore((s) => s.user);

  return (
    <div className="absolute right-0 top-0 z-100 p-3 flex gap-2 items-center">
      <ThemeToggle />
      {user && (
        <Avatar className="w-8.5 h-8.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200">
          <AvatarImage src={user.user.photoURL} />
          <AvatarFallback>{getInitialName(user.user.fullName)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

  ;

export default UserProfile;
