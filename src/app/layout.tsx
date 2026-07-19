import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nebraska Bush Pullers | Dashboard",
  description: "Admin Panel for Nebraska Bush Pullers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased bg-gradient-to-tl from-[#d3cfc5] to-[#e9e7e2] min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
