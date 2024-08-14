import { Space_Mono } from "next/font/google";
import "./globals.css";

const font1 = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Podomoro timer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className = {`${font1.className}`}>{children}</body>
    </html>
  );
}