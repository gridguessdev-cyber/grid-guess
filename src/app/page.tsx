import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Link href="/levels">
        <div className="rounded-xl p-4 flex justify-between items-center bg-white w-lg">
          <span>Explore levels</span>
          <Image src={"/icons/list.svg"} alt="list" width={25} height={25} />
        </div>
      </Link>
      <Link href="/builder">
        <div className="rounded-xl p-4 flex justify-between items-center bg-white w-lg">
          <span>Build your level</span>
          <Image src={"/icons/hammer.svg"} alt="list" width={25} height={25} />
        </div>
      </Link>
    </div>
  );
}
