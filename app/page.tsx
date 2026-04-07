'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StatusScreen from '@/src/shared/components/StatusScreen'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return <StatusScreen message="Redirigiendo al inicio de sesión..." />
}