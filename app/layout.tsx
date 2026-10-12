import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "Научиться учиться",
    template: "%s · Научиться учиться",
  },
  description:
    "Техники и лайфхаки обучения для тех, кто борется с прокрастинацией, расфокусом и невидимым прогрессом.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${sans.variable} h-full antialiased`}>
      <body className={`${sans.className} flex min-h-full flex-col bg-white text-zinc-950`}>
        <SiteHeader />
        <main className="w-full flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
