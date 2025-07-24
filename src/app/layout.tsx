import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import MainLayout from "@/components/mainLayout";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const publicMono = Public_Sans({
  variable: "--font-public-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GMOB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} ${publicMono.variable} bg-gray-200 antialiased `}
      >
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
