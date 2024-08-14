import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

export const metadata = {
  title: "monopodo timer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <SpeedInsights></SpeedInsights>
      <Analytics></Analytics>
    </html>
  );
}