import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import "mapbox-gl/dist/mapbox-gl.css";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hanoi Estate",
  description:
    "Giải pháp đầu tư và phân tích dòng tiền bất động sản cao cấp tại Hà Nội.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cormorant.variable} min-h-screen font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
