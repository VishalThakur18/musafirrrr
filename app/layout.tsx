import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Musafirrrr",
  description: "Find group trips, save the ones you like and enquire directly.",
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