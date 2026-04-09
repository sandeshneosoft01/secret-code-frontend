"use client";
import { useStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserProfile = () => {
  const user = useStore((s) => s.user);
//   const setUser = useStore((s) => s.setUser);

  if(!user) {
    return null
  }

  return (
    <div className="absolute right-0 top-0 z-100 p-3 cursor-pointer">
      <Avatar className="w-10 h-10">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserProfile;
