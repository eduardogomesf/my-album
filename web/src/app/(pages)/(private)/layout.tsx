import { ReactNode } from 'react'

import { Header } from '@/app/components/header'
import { Footer } from '@/app/components/footer'

interface PrivateLayoutProps {
  children: ReactNode
}

export default function PrivateLayout(props: PrivateLayoutProps) {
  return (
    <div className="min-h-screen relative">
      <Header />
      {props.children}
      <Footer />
    </div>
  )
}
