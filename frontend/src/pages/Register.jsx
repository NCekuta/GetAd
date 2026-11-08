import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Stran za registracijo (US-01)
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ display_name: '', email: '', password: '', role: 'creator' });
  const [error, setError] = useState('');

  // Ob spremembi polja posodobimo ustrezno vrednost v obrazcu
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate('/prijava'); // po uspešni registraciji na prijavo
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registracija</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-4">
          <label>
            <input type="radio" name="role" value="creator" checked={form.role === 'creator'} onChange={handleChange} />{' '}
            Ustvarjalec
          </label>
          <label>
            <input type="radio" name="role" value="company" checked={form.role === 'company'} onChange={handleChange} />{' '}
            Podjetje
          </label>
        </div>

        <input
          name="display_name"
          placeholder={form.role === 'company' ? 'Ime podjetja' : 'Prikazno ime'}
          value={form.display_name}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="email"
          type="email"
          placeholder="E-pošta"
          value={form.email}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Geslo (vsaj 8 znakov)"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          required
          className="border rounded p-2"
        />

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
          Ustvari račun
        </button>
      </form>
    </div>
  );
}
