import * as React from 'react'
import ThemeRegistry from '../components/ThemeRegistry'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pantry Manager',
  description: 'Manage your pantry items efficiently',
  icons: {
    icon: '/pantry.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/pantry.png" type="image/png" sizes="16x16" />
      </head>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}