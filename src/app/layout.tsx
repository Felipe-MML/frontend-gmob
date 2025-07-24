import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import MainLayout from "@/components/mainLayout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

        <ToastContainer
          position="top-right"
          autoClose={5000} // Fecha automaticamente após 5 segundos
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
