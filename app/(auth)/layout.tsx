
import Link from "next/link";
import React from "react";
import '../dashboard/style.css'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1  sm:p-0">
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col   sm:p-0">
          {children}
          <div className="bg-gray-900 lg:w-1/2 w-full h-full bg-brand-950  lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              <div className="flex flex-col items-center ">
                <Link href="/" className="block mb-4">
                 <p className="text-3xl text-white">Visa Consultancy Admin panel</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
