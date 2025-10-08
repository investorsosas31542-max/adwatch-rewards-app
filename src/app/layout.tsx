import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

export const metadata: Metadata = {
  title: 'AdWatch Rewards',
  description: 'Earn money just by watching ads',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        {/* 
          =========================================================================
          ** GOOGLE ADSENSE SITE CONNECTION SCRIPT **
          =========================================================================
          This script connects your application to your Google AdSense account.
          You MUST replace "ca-pub-XXXXXXXXXXXXXXXX" with your actual AdSense
          publisher ID for ads to work. You can find this ID in your AdSense
          account dashboard.
          =========================================================================
        */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5029728252248489" 
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
