import { Link } from 'react-router-dom';

// Glava strani z navigacijo
export default function Header() {
  return (
    <header className="bg-white border-b">
      <nav className="max-w-5xl mx-auto p-4 flex items-center gap-6">
        <Link to="/" className="text-xl font-bold">GetAd</Link>
        <Link to="/" className="hover:underline">Questi</Link>
        <div className="ml-auto flex gap-4">
          <Link to="/prijava" className="hover:underline">Prijava</Link>
          <Link to="/registracija" className="hover:underline">Registracija</Link>
        </div>
      </nav>
    </header>
  );
}
