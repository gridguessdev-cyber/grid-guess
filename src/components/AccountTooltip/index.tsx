"use client";
import { useStore } from "@/store/store";
import GoogleSignInButton from "../GoogleSignInButton";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Button } from "@heroui/react";
import { redirect, RedirectType, usePathname } from "next/navigation";

interface Props {
  onEditModalOpen: () => void;
}

export default function AccountTooltip({ onEditModalOpen }: Props) {
  const supabase = createClient();
  const { user, setUser } = useStore((state) => state);
  const pathname = usePathname();

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);

    if (pathname === "/builder") {
      redirect("/levels", RedirectType.replace);
    }
  };

  if (!user) {
    return <GoogleSignInButton />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-3">
        <p>
          Welcome, <b>{user.full_name}</b>
        </p>
        <button
          onClick={onEditModalOpen}
          className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
        >
          <Image src={"/icons/pencil.svg"} alt="edit" width={18} height={18} />
        </button>
      </div>
      <Button onClick={logout} variant="faded" className="w-full mt-2">
        Logout
      </Button>
    </div>
  );
}
