import { Poppins } from "next/font/google";
import "./globals.css";
import { AdminSettingsProvider } from "@/context/AdminSettingsContext";
import DynamicColorProvider from "@/components/DynamicColorProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Tang Mow - Premium Hotel Experience",
  description:
    "Experience luxury and comfort at Tang Mow hotel. Book your perfect stay with our modern booking system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${poppins.variable}`}>
        <AdminSettingsProvider>
          <DynamicColorProvider>{children}</DynamicColorProvider>
        </AdminSettingsProvider>
      </body>
    </html>
  );
}
