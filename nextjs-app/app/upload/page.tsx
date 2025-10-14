'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ALLOWED_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // cleanup preview URL on unmount / file change
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function validateFile(f: File) {
    // size
    if (f.size > MAX_BYTES) {
      return `File troppo grande — massimo ${(MAX_BYTES / (1024 * 1024)).toFixed(1)} MB.`;
    }
    // mime
    if (!ALLOWED_MIME.includes(f.type)) {
      // fallback check extension
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      if (!ALLOWED_EXT.includes(ext)) {
        return `Formato non supportato. Formati consentiti: ${ALLOWED_EXT.join(', ')}`;
      }
    }
    // extension check (extra)
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return `Estensione non valida. Formati consentiti: ${ALLOWED_EXT.join(', ')}`;
    }
    return null;
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMsg(null);
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }

    const err = validateFile(f);
    if (err) {
      setFile(null);
      setPreview(null);
      setMsg({ type: 'error', text: err });
      return;
    }

    const url = URL.createObjectURL(f);
    setPreview(url);
    setFile(f);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!file) {
      setMsg({ type: 'error', text: 'Seleziona un file prima di procedere.' });
      return;
    }

    const err = validateFile(file);
    if (err) {
      setMsg({ type: 'error', text: err });
      return;
    }

    const fd = new FormData();
    fd.append('file', file);

    setLoading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: 'error', text: data?.error || 'Upload fallito' });
        setLoading(false);
        return;
      }

      setMsg({ type: 'success', text: `Upload effettuato: ${data.file}` });
      // Piccolo delay per far vedere il messaggio
      setTimeout(() => router.push('/gallery'), 700);
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Errore di rete durante l\'upload.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '70vh',
        padding: '48px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontFamily: 'var(--font-geist-sans)',
        color: '#e5e7eb',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          borderRadius: 16,
          padding: 28,
          background: 'linear-gradient(180deg, rgba(6,9,14,0.9), rgba(8,14,22,0.85))',
          boxShadow: '0 20px 60px rgba(2,6,23,0.6)',
          border: '1px solid rgba(255,255,255,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Carica immagine</h2>
            <div style={{ marginTop: 6, color: '#9fb6c3' }}>
              Formati consentiti: <strong style={{ color: '#e5e7eb' }}>{ALLOWED_EXT.join(', ')}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => (window.location.href = '/gallery')}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                background: 'transparent',
                color: '#9fb6c3',
                border: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Torna alla gallery
            </button>
          </div>
        </div>

        <form onSubmit={submit} style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
          {/* left: inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label
              htmlFor="file"
              style={{
                display: 'block',
                padding: '14px 16px',
                borderRadius: 12,
                background: 'linear-gradient(90deg,#06131a,#081022)',
                border: '1px dashed rgba(255,255,255,0.03)',
                color: '#9fb6c3',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <input
                id="file"
                type="file"
                accept={ALLOWED_EXT.map(e => '.' + e).join(',')}
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                    {preview ? (
                      <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#0b1220' }} />
                    )}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#e5e7eb', fontWeight: 700 }}>{file.name}</div>
                    <div style={{ color: '#9fb6c3', fontSize: 13 }}>{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#9fb6c3' }}>Clicca per selezionare un'immagine o trascina il file qui</div>
              )}
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                disabled={!file || loading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(90deg,#06b6d4,#3b82f6)',
                  color: '#001',
                  fontWeight: 800,
                  cursor: !file || loading ? 'not-allowed' : 'pointer',
                  opacity: !file || loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading && file) (e.currentTarget.style.background = 'linear-gradient(90deg,#05a2b7,#2563eb)');
                }}
                onMouseLeave={(e) => {
                  if (!loading && file) (e.currentTarget.style.background = 'linear-gradient(90deg,#06b6d4,#3b82f6)');
                }}
              >
                {loading ? 'Caricamento...' : 'Carica immagine'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setMsg(null);
                  // reset input value by recreating input (quick way)
                  const inp = document.getElementById('file') as HTMLInputElement | null;
                  if (inp) inp.value = '';
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: '#0b1220',
                  color: '#9fb6c3',
                  border: '1px solid rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                Annulla
              </button>
            </div>

            <div style={{ color: msg?.type === 'error' ? '#f87171' : msg?.type === 'success' ? '#4ade80' : '#9fb6c3', marginTop: 6 }}>
              {msg ? msg.text : <span style={{ color: '#94a3b8' }}>Dimensione massima consentita — {(MAX_BYTES / (1024 * 1024)).toFixed(0)} MB</span>}
            </div>
          </div>

          {/* right: preview panel */}
          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              background: '#051018',
              border: '1px solid rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: '100%',
                  height: 240,
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            ) : (
              <div style={{ color: '#9fb6c3', textAlign: 'center', padding: '18px' }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Anteprima</div>
                <div style={{ color: '#94a3b8', fontSize: 14 }}>Nessun file selezionato</div>
              </div>
            )}

            <div style={{ width: '100%', padding: '12px 8px' }}>
              <div style={{ color: '#9fb6c3', fontSize: 13, marginBottom: 6 }}>Informazioni file</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 13 }}>
                <div>Nome</div>
                <div style={{ maxWidth: 140, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file ? file.name : '—'}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 13, marginTop: 6 }}>
                <div>Dimensione</div>
                <div>{file ? `${(file.size / 1024).toFixed(0)} KB` : '—'}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 13, marginTop: 6 }}>
                <div>Tipo</div>
                <div>{file ? file.type || '—' : '—'}</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
