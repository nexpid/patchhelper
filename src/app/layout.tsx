import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import "prism-themes/themes/prism-vsc-dark-plus.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? // yes i hardcoded this
        "https://patchhelper.nexpid.xyz"
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Patch Helper",
  description: "An online version of Vencord's patch helper!!!",
  openGraph: {
    images: "/images/shiggy.gif",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="darkreader-lock" />
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center pt-8 px-24 bg-background-primary-light dark:bg-background-primary-dark">
          <div className="w-full max-w-3xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
