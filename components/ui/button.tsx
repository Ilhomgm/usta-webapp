"use client"

import {
  ButtonHTMLAttributes,
  ReactNode,
  forwardRef,
  useEffect,
  useRef
} from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive" | "custom"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  vibrate?: boolean
  autoFocusOnLoad?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading = false,
      startIcon,
      endIcon,
      children,
      disabled,
      vibrate = false,
      autoFocusOnLoad = false,
      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
      if (autoFocusOnLoad && localRef.current) {
        localRef.current.focus()
      }
    }, [autoFocusOnLoad])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (vibrate && typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(30)
      }
      props.onClick?.(e)
    }

    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      outline: "border border-gray-400 text-gray-800 bg-white hover:bg-gray-100 dark:bg-zinc-900 dark:text-white focus:ring-gray-300",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      custom: "" // кастомный будет определяться через className
    }

    const sizeClasses = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg"
    }

    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement>).current = node
          localRef.current = node
        }}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={loading || disabled}
        aria-disabled={loading || disabled}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin w-4 h-4 mr-2" />
        ) : (
          <>
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
            {endIcon && <span className="ml-2">{endIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
