import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EpiGraph',
  description: 'EpiGraph-Disease-Spread-Simulator',
  generator: 'Ali Haider',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
