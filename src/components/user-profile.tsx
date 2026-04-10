"use client";
import { useStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const getInitialName = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join('');
}

const UserProfile = () => {
  const user = useStore((s) => s.user);

  if (!user) {
    return null
  }

  return (
    <div className="absolute right-0 top-0 z-100 p-3 cursor-pointer">
      <Avatar className="w-8.5 h-8.5">
        <AvatarImage src={user.user.photoURL} />
        <AvatarFallback>{getInitialName(user.user.fullName)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserProfile;
