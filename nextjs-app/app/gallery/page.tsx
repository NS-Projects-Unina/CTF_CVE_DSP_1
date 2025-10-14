'use client';

import { useEffect, useState } from 'react';

type Session = { authenticated: boolean; username?: string; isAdmin?: boolean };

export default function GalleryPage() {
  const [images, setImages] = useState<string[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
    fetch('/api/auth/user', { credentials: 'include' })
      .then(r => r.json())
      .then(j => setSession(j))
      .catch(() => setSession({ authenticated: false }));
  }, []);

  async function loadImages() {
    try {
      const r = await fetch('/api/images');
      if (!r.ok) return setImages([]);
      const data = await r.json();
      setImages(data || []);
    } catch {
      setImages([]);
    }
  }

  async function handleDownload(filename: string) {
    setMsg(null);
    try {
      const r = await fetch(`/api/download?file=${encodeURIComponent('/public/images/' + filename)}`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      if (r.status === 403) return setMsg('Devi essere autenticato per scaricare il file.');
      if (!r.ok) return setMsg('Errore nel download.');

      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setMsg('Errore di rete durante il download.');
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#e5e7eb',
        fontFamily: 'var(--font-geist-sans)',
        padding: '60px 20px',
      }}
    >
      {/* HEADER */}
      <section style={{ textAlign: 'center', marginBottom: 50 }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Galleria</h1>
        <p style={{ maxWidth: 700, margin: '12px auto', color: '#9fb6c3', fontSize: 18 }}>
          Esplora le immagini caricate dagli utenti. Solo gli utenti autenticati possono scaricarle.
        </p>
        <div style={{ marginTop: 12, fontSize: 15, color: '#94a3b8' }}>
          {session === null
            ? 'Caricamento sessione...'
            : session.authenticated
            ? `Connesso come ${session.username}`
            : 'Non autenticato'}
        </div>
      </section>

      {/* GALLERY GRID */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 24,
          justifyItems: 'center',
          padding: '0 10px',
        }}
      >
        {images.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              background: 'linear-gradient(135deg,#083046,#071123)',
              borderRadius: 16,
              padding: '60px 20px',
              textAlign: 'center',
              color: '#9fe6f2',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            Nessuna immagine disponibile
          </div>
        )}

        {images.map((f) => (
          <div
            key={f}
            style={{
              width: 280,
              background: 'linear-gradient(180deg,#0b1525,#071123)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={`/images/${encodeURIComponent(f)}`}
              alt={f}
              style={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div style={{ padding: '12px 16px' }}>
              <div
                style={{
                  fontSize: 14,
                  color: '#9fb6c3',
                  marginBottom: 10,
                  wordBreak: 'break-all',
                }}
              >
              </div>

              {session?.authenticated ? (
                <button
                  onClick={() => handleDownload(f)}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    border: 'none',
                    borderRadius: 8,
                    background: 'linear-gradient(90deg,#06b6d4,#3b82f6)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'opacity 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Scarica
                </button>
              ) : (
                <button
                  onClick={() => (window.location.href = '/login')}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    border: 'none',
                    borderRadius: 8,
                    background: '#f97316',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'opacity 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Login per scaricare
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* MESSAGGIO */}
      {msg && (
        <div
          style={{
            marginTop: 40,
            textAlign: 'center',
            color: '#f97316',
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
