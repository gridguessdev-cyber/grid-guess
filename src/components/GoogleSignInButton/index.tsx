"use client";

import { useServices } from "@/providers/ServicesProvider";
import { useStore } from "@/store/store";
import { useEffect, useRef } from "react";

export default function GoogleSignInButton() {
  const { usersService } = useServices();
  const { setUser } = useStore((state) => state);

  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google && buttonRef.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          const user = await usersService.authorizeIdToken(response.credential);
          if (user) {
            const userProfile = await usersService.getUser(user.id);
            if (userProfile) {
              setUser(userProfile);
            }
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
      });
    }
  }, []);

  return <div ref={buttonRef}></div>;
}
