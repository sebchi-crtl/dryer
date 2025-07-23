import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <main className="w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-center justify-center">
          <div className="flex flex-col gap-4 w-full max-w-md px-4 lg:px-0">
            <Image
              src="/onboarding.svg"
              alt="Onboarding icon"
              width={100}
              height={100}
              className="w-full h-auto"
            />
          </div>
          
          {/* Horizontal separator for mobile */}
          <div className="lg:hidden w-full h-px bg-violet-300 my-8"></div>
          
          {/* Vertical separator - hidden on mobile, visible on large screens */}
          <div className="hidden lg:block w-[2px] bg-violet-300 mx-8 self-stretch"></div>
          
          <div className="flex flex-col gap-6 items-center justify-center w-full max-w-md px-4 lg:px-0">
            <div className="text-center text-violet-500 text-4xl md:text-5xl font-semibold font-['Poppins']">
              Welcome
            </div>
            <div className="text-center text-violet-500 text-lg md:text-xl font-normal font-['Poppins'] leading-tight">
              welcome to eco dryer
            </div>
            <Link href="/login" className="w-full ">
              <Button className="bg-violet-500 text-lg text-white w-full font-semibold rounded-xl py-4 md:py-6.5 hover:border-2 hover:bg-violet-100 hover:text-violet-500 hover:border-violet-500 transition-all duration-200">
                Login
              </Button>
            </Link>
              
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-violet-500"></div>
              <div className="text-center text-white text-lg font-normal font-['Poppins'] capitalize leading-none px-4">
                or
              </div>
              <div className="flex-1 h-px bg-violet-500"></div>
            </div>
            <Link href="/register" className="w-full">
              <Button className="border-2 bg-violet-100 text-lg text-violet-500 border-violet-500 w-full font-semibold rounded-xl py-4 md:py-6.5 hover:bg-violet-500 hover:text-white transition-all duration-200">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
