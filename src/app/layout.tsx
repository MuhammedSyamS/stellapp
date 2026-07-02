import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stellapp Dashboard",
  description: "User dashboard for Stellapp WhatsApp bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script type="importmap" dangerouslySetInnerHTML={{
          __html: `
            {
                "imports": {
                    "three": "https://esm.sh/three@0.160.0",
                    "postprocessing": "https://esm.sh/postprocessing@6.34.1"
                }
            }
          `
        }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
