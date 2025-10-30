import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="mx-[10%]">{children}</div>;
}
