import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white shadow-sm", className)} {...props} />
  )
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <div className={cn("p-6", className)} {...props} />
  )
}
