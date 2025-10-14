'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ user, pass }),
      headers: { 'Content-Type': 'application/json' },
    });
    const t = await res.text();
    setMsg(t);
    if (res.ok) router.push('/login');
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
        <h2 style={{ fontSize: 28, margin: 0 }}>Register</h2>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className="input"
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
            className="input"
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
            className="btn"
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
            Register
          </button>
        </form>
        {msg && <pre style={{ color: '#f87171' }}>{msg}</pre>}
      </div>
    </div>
  );
}
