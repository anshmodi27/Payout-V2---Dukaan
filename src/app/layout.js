import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Payout V2 - Dukaan",
  description:
    "Assignment  : Code this Figma design in React with pixel perfection. ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="lg:hidden h-screen flex items-center justify-center bg-[#F2F2F2]">
          <p className="text-3xl text-center">
            For Access and better experience, use Dashboard Desktop or if you
            have tablet then use in horizontal
          </p>
        </div>
        <div className="hidden lg:block">
          <Sidebar />
          <Navbar />
          <div className="ml-[16%] px-10 mt-5">{children}</div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
