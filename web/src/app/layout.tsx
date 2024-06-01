import type { Metadata } from 'next'
import './globals.css'
import { inter } from './fonts'
import QueryProvider from './providers/ReactQueryProvider'
import { Toaster } from 'sonner'

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
