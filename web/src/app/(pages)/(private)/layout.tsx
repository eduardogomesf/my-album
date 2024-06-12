import { ReactNode } from 'react'

import { Footer } from '@/app/components/footer'
import { Header } from '@/app/components/header'

interface PrivateLayoutProps {
  children: ReactNode
}

export default function PrivateLayout(props: PrivateLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <Header />
      {props.children}
      <Footer />
    </div>
  )
}
