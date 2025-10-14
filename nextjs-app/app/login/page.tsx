'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type MsgType = { type: 'error' | 'success'; text: string };

export default function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState<MsgType | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass }),
      });

      const data = await res.json(); // backend deve restituire { success: boolean, message: string }
      setMsg({ type: data.success ? 'success' : 'error', text: data.message });

      if (data.success) {
        window.dispatchEvent(new Event('auth-change'));
        setTimeout(() => router.push('/'), 500); // piccolo delay per mostrare messaggio
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Errore di connessione al server' });
    }
  }

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: '100%',
          padding: 32,
          borderRadius: 16,
          boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
          background: 'rgba(6,9,14,0.9)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <h2 style={{ fontSize: 28, margin: 0 }}>Login</h2>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            placeholder="Username"
            value={user}
            onChange={e => setUser(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid #3b82f6',
              background: '#0f172a',
              color: '#fff',
              outline: 'none',
              transition: '0.2s',
            }}
          />
          <input
            placeholder="Password"
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid #3b82f6',
              background: '#0f172a',
              color: '#fff',
              outline: 'none',
              transition: '0.2s',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#3b82f6',
              fontWeight: 600,
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
            onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}
          >
            Login
          </button>
        </form>

        {msg && (
          <div style={{ color: msg.type === 'error' ? '#f87171' : '#4ade80', fontWeight: 500 }}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}
