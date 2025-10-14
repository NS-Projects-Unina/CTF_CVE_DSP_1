'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/auth/user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);


  const featuredImages = [
    '/images/github.jpg',
    '/images/hackademy.jpg',
    '/images/spr.jpg',
  ];

  return (
    <div style={{ fontFamily: "var(--font-geist-sans)", scrollBehavior: 'smooth', color: '#e5e7eb' }}>
      {/* HERO */}
      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '60px 20px', gap: 24 }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800 }}>Vuln Gallery</h1>
        <p style={{ maxWidth: 700, color: '#9fb6c3', fontSize: 18 }}>
          Una galleria didattica per imparare la sicurezza web: esplora immagini, carica contenuti, e scopri vulnerabilità in un laboratorio sicuro.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
          <Link href="/gallery">
            <button style={{ padding: '12px 28px', fontSize: 16, borderRadius: 8, border: 'none', background: 'linear-gradient(90deg,#06b6d4,#3b82f6)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Visualizza Galleria
            </button>
          </Link>
          <Link href={authenticated ? '/upload' : '/login?next=/upload'}>
            <button style={{ padding: '12px 28px', fontSize: 16, borderRadius: 8, border: 'none', background: '#f97316', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Carica Immagine
            </button>
          </Link>
        </div>
      </section>

      {/* GALLERY HERO */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '50px 20px', flexWrap: 'wrap' }}>
        {featuredImages.map((src, idx) => (
      <div
        key={idx}
        style={{
          width: 320,
          height: 300,
          aspectRatio: '4/3',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          transition: 'transform 0.3s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
      <Image
        src={src}
        alt={`Featured ${idx + 1}`}
        width={300}
        height={240}
        layout="responsive"
        objectFit="cover"
      />

      </div>

        ))}
      </section>

      {/* COME FUNZIONA */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: 24 }}>Come funziona</h2>
        <p style={{ maxWidth: 800, margin: '0 auto 32px', color: '#9fb6c3', fontSize: 18 }}>
          La galleria è pubblica: chiunque può osservare le immagini caricate. Le azioni sensibili come upload e download richiedono autenticazione.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px', padding: 24, borderRadius: 16, background: 'linear-gradient(135deg,#083046,#071123)', color: '#9fe6f2', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
            <h4>Galleria Pubblica</h4>
            <p>Chiunque può vedere le immagini caricate.</p>
          </div>
          <div style={{ flex: '1 1 220px', padding: 24, borderRadius: 16, background: 'linear-gradient(135deg,#083046,#071123)', color: '#9fe6f2', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
            <h4>Upload Protetto</h4>
            <p>Solo utenti registrati possono caricare immagini.</p>
          </div>
          <div style={{ flex: '1 1 220px', padding: 24, borderRadius: 16, background: 'linear-gradient(135deg,#083046,#071123)', color: '#9fe6f2', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
            <h4>Download Protetto</h4>
            <p>Solo utenti autenticati possono scaricare i file.</p>
          </div>
        </div>
      </section>

      {/* CTA REGISTRAZIONE */}
      <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#0f172a' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>Inizia ora</h2>
        <p style={{ color: '#9fb6c3', marginBottom: 24 }}>Registrati o effettua il login per caricare e interagire con la galleria.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/register">
            <button style={{ padding: '12px 28px', fontSize: 16, borderRadius: 8, border: 'none', background: '#06b6d4', color: '#000', fontWeight: 600, cursor: 'pointer' }}>Registrati</button>
          </Link>
          <Link href="/login">
            <button style={{ padding: '12px 28px', fontSize: 16, borderRadius: 8, border: 'none', backgroundColor: '#f97316', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Login</button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px 20px', textAlign: 'center', backgroundColor: '#0f172a', color: '#6b7280' }}>
        <p style={{ marginBottom: 8 }}>© 2025 Simone Rinaldi. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}
