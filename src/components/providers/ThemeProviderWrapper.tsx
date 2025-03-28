// components/providers/ThemeProviderWrapper.tsx
'use client';

import { ThemeProvider } from 'next-themes';

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}