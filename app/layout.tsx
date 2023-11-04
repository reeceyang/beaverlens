import "../globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import type { Metadata } from 'next'
import Footer from "../components/Footer";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Beaver Lens",
  description: "Explore an archive of over 5,000 MIT Confessions.",
  metadataBase: new URL("https://beaverlens.reeceyang.xyz/"),
  openGraph: {
    title: "Beaver Lens",
    description: "Explore an archive of over 5,000 MIT Confessions.",
    url: "/",
    siteName: "Beaver Lens",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-clip">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
