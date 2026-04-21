// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
// import './globals.css'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Your app description',
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}