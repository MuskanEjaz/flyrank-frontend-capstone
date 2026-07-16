import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import SiteShell from "./components/site-shell";

const headingFont = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskFlow | FE-04 Capstone",
  description: "A polished task management capstone experience built with Next.js App Router.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[color:var(--background)] text-[color:var(--foreground)]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
