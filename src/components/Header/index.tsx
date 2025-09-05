"use client";
import { Tooltip } from "@heroui/tooltip";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";
import Script from "next/script";
import { useStore } from "@/store/store";

export default function Header() {
  const { user } = useStore((state) => state);

  return (
    <div className="mb-5 mx-[10%]">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 justify-start gap-3">
          <Link href="/levels" className="hover:underline" prefetch>
            Explore levels
          </Link>
          {user && (
            <Link href={`/builder`} className="hover:underline" prefetch>
              Build your level
            </Link>
          )}
          {!user && (
            <Tooltip
              closeDelay={50}
              placement="bottom"
              content={
                <div className="px-1 py-2 text-center flex flex-col gap-2">
                  Sign in to build your levels
                  <GoogleSignInButton />
                </div>
              }
            >
              <Link href="#" className="hover:underline" prefetch>
                Build your level
              </Link>
            </Tooltip>
          )}
        </div>
        <p className="alfa-slab-one-regular text-center my-5 text-3xl flex-1">
          Countries Grid
        </p>
        <div className="flex flex-1 justify-end">
          <Tooltip
            closeDelay={50}
            placement="bottom-end"
            content={
              <div className="px-1 py-2">
                <GoogleSignInButton />
              </div>
            }
          >
            <button>Account</button>
          </Tooltip>
        </div>
      </div>
      <hr />
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
    </div>
  );
}
