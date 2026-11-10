import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Doodle, { Scribble } from '../components/Doodle.jsx';

// Vloge, med katerimi uporabnik izbira s klikom na kartico
const roles = [
  { role: 'creator', title: 'Ustvarjalec', text: 'Ustvarjaš AI video oglase in se poteguješ za nagrade.', doodle: 'camera' },
  { role: 'company', title: 'Podjetje', text: 'Objaviš quest in izbereš najboljši video za svoj oglas.', doodle: 'phone' },
];

// Stran za registracijo (US-01): najprej izbira vloge, nato obrazec
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ display_name: '', email: '', password: '', role: '' });
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

  // 1. korak: izbira vloge
  if (!form.role) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="font-hand font-bold text-5xl">Registracija</h1>
        <Scribble className="w-56 h-3 text-line mb-2" />
        <p className="text-muted mb-8">Kdo si?</p>

        <div className="grid sm:grid-cols-2 gap-6">
          {roles.map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => setForm({ ...form, role: r.role })}
              className="card p-6 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-accent"
            >
              <Doodle name={r.doodle} className="h-28 text-line" />
              <span className="font-hand font-bold text-3xl">{r.title}</span>
              <span className="text-muted">{r.text}</span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">
          Že imaš račun? <Link to="/prijava" className="text-accent hover:underline">Prijavi se</Link>
        </p>
      </div>
    );
  }

  // 2. korak: obrazec za izbrano vlogo
  const isCompany = form.role === 'company';

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="font-hand font-bold text-5xl">{isCompany ? 'Podjetje' : 'Ustvarjalec'}</h1>
      <Scribble className="w-48 h-3 text-line mb-2" />
      <button type="button" onClick={() => setForm({ ...form, role: '' })} className="text-sm text-muted hover:text-accent mb-6">
        ← zamenjaj vlogo
      </button>

      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
        <label>
          {isCompany ? 'Ime podjetja' : 'Prikazno ime'}
          <input name="display_name" value={form.display_name} onChange={handleChange} required className="input" />
        </label>
        <label>
          E-pošta
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" />
        </label>
        <label>
          Geslo (vsaj 8 znakov)
          <input name="password" type="password" value={form.password} onChange={handleChange} minLength={8} required className="input" />
        </label>

        {error && <p className="text-red-400">{error}</p>}

        <button type="submit" className="btn">Ustvari račun</button>
      </form>
    </div>
  );
}
