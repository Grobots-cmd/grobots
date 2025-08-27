import { Poppins } from 'next/font/google';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata = {
  title: "GROBOTS - Building Tomorrow's Innovators",
  description: "Join our vibrant robotics community where creativity meets engineering excellence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground overflow-x-hidden">
        <Navbar /> 
        {children}
        <Footer />
      </body>
    </html>
  );
}
