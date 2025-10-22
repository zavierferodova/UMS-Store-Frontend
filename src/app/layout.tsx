import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UMS Store - Official Campus Shop',
  description:
    'Toko resmi Universitas Muhammadiyah Surakarta yang menyediakan berbagai kebutuhan akademik dan merchandise eksklusif. Temukan buku kuliah terbaru, merchandise resmi UMS, dan perlengkapan belajar berkualitas. Nikmati kemudahan berbelanja online dan dukungan penuh untuk seluruh civitas akademika UMS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
