import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const title = "ZenKoi - Trang Trại Cá Koi Premium";
  const description = "Hệ thống quản lý trang trại cá Koi thông minh và bán hàng chuyên nghiệp. Cung cấp cá Koi Nhật Bản chất lượng cao với dịch vụ tư vấn chuyên nghiệp.";
  const keywords = [
    "cá koi",
    "trang trại cá koi", 
    "cá koi nhật bản",
    "bán cá koi",
    "nuôi cá koi",
    "cá cảnh cao cấp",
    "ZenKoi",
    "koi farm",
    "japanese koi"
  ];

  return {
    title: {
      default: title,
      template: "%s | ZenKoi"
    },
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "ZenKoi Team" }],
    creator: "ZenKoi",
    publisher: "ZenKoi",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: "/",
      siteName: "ZenKoi",
      title,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "ZenKoi - Trang Trại Cá Koi Premium",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
      creator: "@zenkoi",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: '/ZenKoi.png',
      apple: '/ZenKoi.png',
    },
    manifest: "/manifest.json",
    category: "business",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
