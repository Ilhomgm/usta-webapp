import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`rounded-2xl shadow bg-white dark:bg-zinc-800 ${className}`}>
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`px-4 py-3 border-b border-gray-200 dark:border-zinc-700 ${className}`}>
      {children}
    </div>
  )
}

const CardContent = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`px-4 py-2 ${className}`}>
      {children}
    </div>
  )
}

const CardFooter = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`px-4 py-3 border-t border-gray-200 dark:border-zinc-700 ${className}`}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardContent, CardFooter }
