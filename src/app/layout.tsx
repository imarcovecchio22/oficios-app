// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/shared/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OficiosApp",
  description: "Contratá profesionales de confianza",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
