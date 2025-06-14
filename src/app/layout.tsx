import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import TanstackProvider from "@/providers/TanstackProvider";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Suspense } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable}  antialiased bg-primary-foreground`}
        >
          <header className="flex justify-between  items-center p-4 gap-4 h-16 px-32">
            <div>
              <h1 className="text-2xl text-slate-900 font-semibold">Cody</h1>
            </div>
            <div>
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          <TanstackProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </TanstackProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
