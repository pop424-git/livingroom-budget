import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Thai, Noto_Serif_Thai } from "next/font/google";
import "./globals.css";

const thai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-thai",
  display: "swap",
});

/** Headings and the big totals — gives the page a drawn, editorial feel. */
const serif = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500"],
  variable: "--font-serif-thai",
  display: "swap",
});

/** Section numbers and small labels, like the annotations on a plan. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "สรุปยอดห้องนั่งเล่น",
  description: "รายการค่าใช้จ่ายงานสร้างห้องนั่งเล่น 4×8 ม. พร้อมระเบียงเอ็นกาวะ",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      className={`${thai.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
