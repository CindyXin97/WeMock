"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type Theme = "dark" | "light" | "system"
type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: "class" | "data-theme" | "data-mode"
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 