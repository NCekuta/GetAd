import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { Scribble } from '../components/Doodle.jsx';

// Stran za prijavo (US-01)
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const err = await login(email, password);
    if (err) {
      setError(err);
    } else {
      navigate('/'); // po prijavi na domačo stran
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="font-hand font-bold text-5xl">Prijava</h1>
      <Scribble className="w-40 h-3 text-line mb-6" />

      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
        <label>
          E-pošta
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
        </label>
        <label>
          Geslo
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
        </label>

        {error && <p className="text-red-400">{error}</p>}

        <button type="submit" className="btn">Prijava</button>
      </form>

      <p className="mt-4 text-sm text-muted">
        Nimaš računa?{' '}
        <Link to="/registracija" className="text-accent hover:underline">Registriraj se</Link>
      </p>
    </div>
  );
}
