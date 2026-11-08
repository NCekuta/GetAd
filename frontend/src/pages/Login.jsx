import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

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
      <h1 className="text-2xl font-bold mb-4">Prijava</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="E-pošta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded p-2"
        />
        <input
          type="password"
          placeholder="Geslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded p-2"
        />

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
          Prijava
        </button>
      </form>

      <p className="mt-4 text-sm">
        Nimaš računa?{' '}
        <Link to="/registracija" className="text-blue-600 hover:underline">Registriraj se</Link>
      </p>
    </div>
  );
}
