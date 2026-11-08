import { createContext, useContext, useEffect, useState } from 'react';

// Skupno stanje prijave, dostopno vsem komponentam prek useAuth()
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // prijavljen uporabnik ali null
  const [loading, setLoading] = useState(true); // ali še preverjamo prijavo

  // Ob nalaganju strani vprašamo backend, ali smo že prijavljeni (piškotek)
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  // Vrne sporočilo o napaki ali null, če je prijava uspela
  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error;
    setUser(data);
    return null;
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
