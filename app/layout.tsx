import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Poppins } from 'next/font/google';
import Script from "next/script";
import QueryProvider from "./providers/QueryProvider";
import { Toaster } from "sonner";
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>

 <QueryProvider>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        {children}
                <Toaster richColors position="top-right" />
          </QueryProvider>
      </body>
    </html>
  );
}
