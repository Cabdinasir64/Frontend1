import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontend1",
  description: "Only Learning connect fronted and backend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
