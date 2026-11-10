import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const roleNames = { company: 'podjetje', creator: 'ustvarjalec', admin: 'administrator' };

// Glava strani z navigacijo
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="bg-white border-b">
      <nav className="max-w-5xl mx-auto p-4 flex items-center gap-6">
        <Link to="/" className="text-xl font-bold">GetAd</Link>
        <Link to="/" className="hover:underline">Questi</Link>
        {user?.role === 'company' && <Link to="/questi/nov" className="hover:underline">Nov quest</Link>}

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.display_name} ({roleNames[user.role]})
              </span>
              <button onClick={handleLogout} className="hover:underline">Odjava</button>
            </>
          ) : (
            <>
              <Link to="/prijava" className="hover:underline">Prijava</Link>
              <Link to="/registracija" className="hover:underline">Registracija</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
