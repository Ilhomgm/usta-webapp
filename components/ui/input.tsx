"use client"
import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn("border px-4 py-2 rounded w-full", className)}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
