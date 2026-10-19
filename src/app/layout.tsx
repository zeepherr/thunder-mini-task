import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Work List",
  description: "A personal workspace for managing tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
