import { ReactNode } from "react"

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded border shadow p-4 bg-white">
      {children}
    </div>
  )
}
