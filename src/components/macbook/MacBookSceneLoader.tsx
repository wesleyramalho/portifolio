'use client'

import dynamic from 'next/dynamic'

const MacBookScene = dynamic(() => import('./MacBookScene'), { ssr: false })

export default function MacBookSceneLoader() {
  return <MacBookScene />
}
