'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthNav() {
  // 1. Aggiorna l'interfaccia dello stato per includere 'isAdmin'
  const [session, setSession] = useState<{
    authenticated: boolean;
    username?: string;
    isAdmin?: boolean; // Aggiunto campo per il ruolo admin
  }>({
    authenticated: false,
  });
  const router = useRouter();

  async function fetchSession() {
    const res = await fetch('/api/auth/user', { credentials: 'include' });
    if (res.ok) {
      setSession(await res.json());
    } else {
      setSession({ authenticated: false });
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await fetchSession();
    router.push('/');
  }

  useEffect(() => {
    fetchSession();
    window.addEventListener('auth-change', fetchSession);
    return () => window.removeEventListener('auth-change', fetchSession);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {session.authenticated ? (
        <>
          <Link href="/gallery" style={{ color: '#3b82f6', fontWeight: 600 }}>
            Galleria
          </Link>
          <Link href="/upload" style={{ color: '#3b82f6', fontWeight: 600 }}>
            Upload
          </Link>

          {/* 2. Mostra questo link solo se l'utente è un admin */}
          {session.isAdmin && (
            <Link href="/admin" style={{ color: '#ef4444', fontWeight: 'bold' }}>
              Trasforma
            </Link>
          )}

          <button
            onClick={handleLogout}
            style={{
              border: 'none',
              background: 'none',
              color: '#f87171',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1em', // Allinea la dimensione del font
            }}
          >
            Logout ({session.username})
          </button>
        </>
      ) : (
        <>
          <Link href="/gallery" style={{ color: '#3b82f6', fontWeight: 600 }}>
            Galleria
          </Link>
          <Link href="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>
            Login
          </Link>
          <Link href="/register" style={{ color: '#3b82f6', fontWeight: 600 }}>
            Registrati
          </Link>
        </>
      )}
    </div>
  );
}