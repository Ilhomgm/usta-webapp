import './globals.css' import { Inter } from 'next/font/google' import { Metadata } from 'next' import { Toaster } from '@/components/ui/sonner' import Navbar from '@/components/layout/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = { title: { default: 'USTA SuperApp', template: '%s | USTA', }, description: 'Платформа по мастерам, услугам и объявлениям по всей стране.', }

export default function RootLayout({ children, }: { children: React.ReactNode }) { return ( <html lang="ru"> <body className={inter.className}> <Navbar /> <main className="min-h-screen bg-slate-50 p-4"> {children} </main> <Toaster position="top-center" richColors /> </body> </html> ) }

