'use client'
 
import dynamic from 'next/dynamic'
 
const FamilyTree = dynamic(() => import('@/components/family-tree'), { ssr: false })
 
export default function Home() {
  return (
    <main>
      <FamilyTree />
    </main>
  )
}
