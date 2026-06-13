import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Add this import

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Cube Solver | Shaunak",
  description: "Algorithmic Rubik's Cube Solver",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans bg-[#0a0a0a] text-[#ededed] antialiased transition-colors duration-300 dark:bg-[#0a0a0a] dark:text-[#ededed] bg-white text-black`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}