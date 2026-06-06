import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aura — Premium Task Space',
  description: 'Elegant and minimalist task management platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)" />
        <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossOrigin="anonymous" />
        <link href="[https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap](https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap)" rel="stylesheet" />
      </head>
      <body className="bg-[#FAF9F6] text-[#1C1C1E] antialiased min-h-screen selection:bg-neutral-200 selection:text-neutral-900">
        {children}
      </body>
    </html>
  )
}