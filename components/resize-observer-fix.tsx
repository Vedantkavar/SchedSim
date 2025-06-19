"use client"

import React from "react"

/**
 * Silences the “ResizeObserver loop completed with undelivered notifications”
 * error that sometimes bubbles up in Chromium-based browsers when many rapid
 * layout changes occur (e.g. CSS transitions / animations).
 *
 * NOTE: This only traps that single ResizeObserver message so normal errors
 *       still surface in the console.
 */
export default function ResizeObserverFix() {
  React.useEffect(() => {
    const handler = (event: ErrorEvent) => {
      if (
        event.message === "ResizeObserver loop completed with undelivered notifications." ||
        event.message === "ResizeObserver loop limit exceeded"
      ) {
        event.stopImmediatePropagation()
      }
    }

    window.addEventListener("error", handler)
    return () => window.removeEventListener("error", handler)
  }, [])

  // Nothing is rendered – this component only attaches the listener once.
  return null
}
