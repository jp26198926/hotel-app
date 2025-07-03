import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Tang Mow - Premium Hotel Experience",
  description:
    "Experience luxury and comfort at Tang Mow hotel. Book your perfect stay with our modern booking system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
