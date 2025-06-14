'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Автоматический переход на карту мастеров
    router.push('/map');
  }, [router]);

  return null;
}
