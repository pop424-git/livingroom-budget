import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const thai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-thai",
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
    <html lang="th" className={thai.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
