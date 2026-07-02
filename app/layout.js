import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Adam Fartout — Digital Transformation & AI Engineer",
  description:
    "Portfolio of Adam Fartout, a Digital Transformation & AI Engineering student passionate about intelligent software, cloud computing, and workflow optimization.",
  keywords: [
    "Adam Fartout",
    "Portfolio",
    "AI Engineer",
    "Digital Transformation",
    "Full Stack Developer",
  ],
  authors: [{ name: "Adam Fartout" }],
  openGraph: {
    title: "Adam Fartout — Digital Transformation & AI Engineer",
    description:
      "Explore the work, journey, and skills of Adam Fartout — building intelligent software with intent.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
