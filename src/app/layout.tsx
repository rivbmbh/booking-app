import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";
// import { auth } from "";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "Online Booking Hotel",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="bg-zinc-200 min-h-screen">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
