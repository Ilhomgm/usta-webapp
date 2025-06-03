'use client'

import { useEffect, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Card } from '@/components/ui/card'

type Master = {
  id: number
  name: string
  lat: number
  lng: number
  category: string
}

export default function MapPage() {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [masters, setMasters] = useState<Master[]>([
    { id: 1, name: 'Абдуллаев Азиз', lat: 41.311081, lng: 69.240562, category: 'Электрик' },
    { id: 2, name: 'Жураев Марат', lat: 41.3275, lng: 69.2817, category: 'Сантехник' },
  ])

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
    })

    loader.load().then(() => {
      const mapInstance = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 41.311081, lng: 69.240562 },
        zoom: 12,
      })

      masters.forEach((master) => {
        const marker = new google.maps.Marker({
          position: { lat: master.lat, lng: master.lng },
          map: mapInstance,
          title: master.name,
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${master.name}</strong><br/>${master.category}</div>`,
        })

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker)
        })
      })

      setMap(mapInstance)
    })
  }, [masters])

  return (
    <main className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Мастера на карте</h1>
      <Card className="overflow-hidden shadow-md">
        <div id="map" className="w-full h-[600px]" />
      </Card>
    </main>
  )
}
