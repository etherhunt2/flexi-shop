import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "PixShop - Modern E-commerce Store",
  description: "Discover amazing products at great prices. Shop electronics, fashion, home & garden, and more.",
  keywords: "ecommerce, shopping, electronics, fashion, home, garden",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
