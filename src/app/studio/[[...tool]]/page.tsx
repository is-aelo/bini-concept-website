'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import dynamic from 'next/dynamic'

//force the studio to only load on the client side (browser)
const Studio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
)

export default function StudioPage() {
  // Use the dynamically imported Studio component
  return <Studio config={config} />
}