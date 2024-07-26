import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const raleway = Raleway ({ subsets: ["latin"] , weight: ['400', '500', '600'], variable: '--raleway'});

export const metadata: Metadata = {
  title: "ScaleUp",
  description: "A planner to boost your business potential",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-dark-300 raleway antialiased', raleway.variable )}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}

      </ThemeProvider>

      </body>
    </html>
  );
}
