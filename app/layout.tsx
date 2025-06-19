import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "OS Scheduling Algorithms Visualizer",
  description: "Interactive visualization of CPU scheduling algorithms",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Suppress ResizeObserver errors
  if (typeof window !== "undefined") {
    const originalError = console.error
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("ResizeObserver loop completed with undelivered notifications")
      ) {
        return
      }
      originalError.apply(console, args)
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
