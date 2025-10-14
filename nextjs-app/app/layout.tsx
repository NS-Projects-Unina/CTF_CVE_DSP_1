// app/layout.tsx
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import AuthNav from './components/AuthNav';
import Link from 'next/link';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backdropFilter: 'blur(6px)',
            background: 'rgba(6,9,14,0.6)',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
          }}
        >
          <nav
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
            }}
          >
            {/* Logo e titolo */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link
                href="/"
                style={{
                  display: 'flex',
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg,#06b6d4,#3b82f6)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#012',
                  textDecoration: 'none',
                  fontSize: 16,
                }}
              >
                CTF
              </Link>
              <div>
                <div style={{ fontWeight: 700 }}>Vuln Gallery</div>
                <div style={{ fontSize: 12, color: '#9fb6c3' }}>Learning Network Security</div>
              </div>
            </div>

            {/* Nav dinamica */}
            <AuthNav />
          </nav>
        </header>

        <main style={{ maxWidth: 1100, margin: '24px auto', padding: '0 20px' }}>
          {children}
        </main>

        <footer
          style={{
            marginTop: 40,
            padding: '24px 20px',
            color: '#8fb3be',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            fontSize: 14,
          }}
        >
          © 2025 Simone Rinaldi — Tutti i diritti riservati
        </footer>
      </body>
    </html>
  );
}
