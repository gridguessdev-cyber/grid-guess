"use client";

import { useStore } from "@/store/store";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef } from "react";

export default function GoogleSignInButton() {
  const supabase = createClient();
  const { user, setUser } = useStore();

  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google && buttonRef.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
          });
          if (data) {
            setUser(data.user);
          }
          if (error) {
            alert(error.message);
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

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div>
      {!user && <div ref={buttonRef}></div>}
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
}
