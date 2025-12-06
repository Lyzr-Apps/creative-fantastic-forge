import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Verifone AI Support Agent',
  description: 'Intelligent voice-enabled customer support system for Verifone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
