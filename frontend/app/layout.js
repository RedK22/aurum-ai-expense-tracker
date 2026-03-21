import { Roboto } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/optics/sonner";
import BackgroundLayer from "@/components/BackgroundLayer";
import { ThemeProviderCustom } from "@/components/theme-context";
import SmoothScroll from "@/components/smooth-scroll";
import { CurrencyProvider } from "@/components/currency-context";
import AuthInit from "@/lib/AuthInit";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Expense Tracker",
  description: "AI-powered expense tracking app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${roboto.className} antialiased`}>
        <CurrencyProvider>
          <SmoothScroll />
          <ThemeProviderCustom>
            <AuthInit />
            {/* Only the background is overflow-hidden and absolutely positioned */}
            <div className="relative min-h-screen w-full">
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <BackgroundLayer />
              </div>
              {/* Main app content is NOT overflow-hidden */}
              <div className="relative z-10 flex min-h-screen flex-col">
                <TooltipProvider>
                  <Navbar />
                  <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
                    {children}
                  </div>
                </TooltipProvider>
              </div>
              <Toaster position="bottom-right" richColors closeButton />
            </div>
          </ThemeProviderCustom>
        </CurrencyProvider>
      </body>
    </html>
  );
}