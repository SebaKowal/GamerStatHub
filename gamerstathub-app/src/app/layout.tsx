"use client";
import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/componentsquery-provider";
import NavbarComponent from "@/components/ui/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import SiteFooter from "@/components/ui/footer";
import { Divider } from "@nextui-org/divider";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const defaultMetadata = {
  title: "GamerStatHub",
  description: "GamerStatHub-app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isProfilePage = pathname === "/profile";
  const metadata = isProfilePage
    ? {
        ...defaultMetadata,
        title: "GamerStatHub",
        description: "GamerStatHub-app",
      }
    : defaultMetadata;

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <NavbarComponent />
              <Divider orientation="horizontal" />
              {children}
            </QueryProvider>

            <Divider orientation="horizontal" />
            <SiteFooter />
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </>
  );
}
