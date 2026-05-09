import type { Metadata } from 'next'
import { Syne, JetBrains_Mono, Inter, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// ── Font definitions (next/font/google — zero layout shift) ──────────────
const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

// ── Default OG metadata (overridden per page) ─────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: 'StackAudit — AI Spend Audit Tool',
  description:
    'Know exactly what you\'re overpaying for AI tools — and what to do about it. Free, no login required.',
  openGraph: {
    title: 'StackAudit — AI Spend Audit Tool',
    description: 'Know exactly what you\'re overpaying for AI tools — and what to do about it.',
    siteName: 'StackAudit',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackAudit — AI Spend Audit Tool',
    description: 'Know exactly what you\'re overpaying for AI tools — and what to do about it.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(syne.variable, jetbrainsMono.variable, inter.variable, "font-sans", geist.variable)}
    >
      <head>
        {/* Material Symbols Outlined icon font */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-surface">
        {/* ── Site Header ─────────────────────────────────────────────── */}
        <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-6 h-16 max-w-[1440px] mx-auto z-50 sticky top-0">
          <div className="flex items-center gap-4">
            <a href="/" className="font-headline-md text-headline-md tracking-tighter text-on-surface uppercase hover:text-primary-container transition-colors">
              StackAudit
            </a>
          </div>
          <div className="flex items-center">
            <a
              href="/#audit-form"
              className="bg-primary-container text-surface px-4 py-2 font-label-caps text-label-caps rounded-none hover:bg-primary-fixed-dim transition-colors uppercase tracking-widest font-bold"
            >
              Run Audit
            </a>
          </div>
        </header>

        {children}

        {/* ── Site Footer ─────────────────────────────────────────────── */}
        <footer className="bg-background border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full py-4 px-6 max-w-[1440px] mx-auto mt-auto">
          <span className="text-on-surface-variant font-label-caps text-label-caps mb-4 md:mb-0">
            © 2025 StackAudit · Built for Credex
          </span>
          <div className="flex gap-6">
            <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors font-label-caps text-label-caps">
              Privacy Policy
            </a>
            <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors font-label-caps text-label-caps">
              Terms of Service
            </a>
            <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors font-label-caps text-label-caps">
              Security
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
