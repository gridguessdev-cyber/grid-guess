import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Link href="/levels">Go to levels list</Link>
      <Link href="/builder">Open builder</Link>
    </div>
  );
}
