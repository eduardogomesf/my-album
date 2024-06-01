import './globals.css'

import type { Metadata } from 'next'
import { Toaster } from 'sonner'

import { inter } from './fonts'
import QueryProvider from './providers/ReactQueryProvider'

export const metadata: Metadata = {
  title: 'My Album',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <QueryProvider>
          <Toaster richColors />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
