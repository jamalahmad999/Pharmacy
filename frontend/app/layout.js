import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Smart Pharmacy - Your Health, Our Priority",
  description: "Smart Pharmacy - Premium healthcare products, medicines, supplements, and personal care items delivered to your doorstep.",
  icons: {
    icon: '/logo smart.png',
    shortcut: '/logo smart.png',
    apple: '/logo smart.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo smart.png" type="image/png" />
        <link rel="shortcut icon" href="/logo smart.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo smart.png" />
      </head>
      <body className={`${inter.variable} font-inter antialiased`}>
        <CartProvider>
          <WishlistProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

