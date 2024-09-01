import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
    >
      <div className='flex items-center'>
        <Link className='mr-8' href='/'>
          <Image src='/compmaster-logo.svg' alt='logo' width={64} height={64}/>
        </Link>
        <div className='flex flex-col space-y-5 border-l-2 px-8'>
          <button
              className='flex items-center justify-center bg-white min-w-64 space-x-3 p-3 border-2 rounded-xl drop-shadow-sm'>
            <Image src='/wca-logo.svg' alt='logo' width={18} height={18}/>
            <p>Sign in with WCA</p>
          </button>
          <button
              className='flex items-center justify-center bg-white min-w-64 space-x-3 p-3 border-2 rounded-xl drop-shadow-sm'>
            Sign in with an access code
          </button>
        </div>
      </div>
    </main>
  );
}
