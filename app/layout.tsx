import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nook",
  description:
    "An isometric building game block by block. Your world, your creations, your rules",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
