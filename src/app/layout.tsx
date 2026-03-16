import type { Metadata } from 'next'
import { Montserrat_Alternates, Orbitron } from 'next/font/google'
import './globals.css'
import FluidCanvas from '@/components/fluid/FluidCanvas'

const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat-alt',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: 'Wesley Ramalho — Senior Software Engineer',
  description: 'Portfolio of Wesley Ramalho, Senior Software Engineer & AI Specialist.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${montserratAlternates.variable} ${orbitron.variable}`}
    >
      <body className="antialiased bg-background text-foreground">
        <FluidCanvas />
        {children}
      </body>
    </html>
  )
}
