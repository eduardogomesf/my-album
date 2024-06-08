import { ReactNode } from 'react'

import { Header } from '@/app/components/common/header'

interface PrivateLayoutProps {
  children: ReactNode
}

export default function PrivateLayout(props: PrivateLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      {props.children}
    </div>
  )
}
