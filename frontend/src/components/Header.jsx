import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import Doodle, { Scribble } from './Doodle.jsx';

const roleNames = { company: 'podjetje', creator: 'ustvarjalec', admin: 'administrator' };

// Povezava v meniju; aktivna je podčrtana s počečkano črto
function MenuLink({ to, children }) {
  return (
    <NavLink to={to} end className={({ isActive }) => (isActive ? 'text-ink' : 'text-muted hover:text-ink')}>
      {({ isActive }) => (
        <span className="flex flex-col items-center">
          {children}
          <Scribble className={`w-full h-2 text-line ${isActive ? '' : 'invisible'}`} />
        </span>
      )}
    </NavLink>
  );
}

// Glava strani z navigacijo. Podjetje vidi samo svoje queste.
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="border-b-[1.5px] border-dashed border-muted/40">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <Link to="/" className="flex items-center gap-2 font-hand font-bold text-3xl">
          <Doodle name="logo" className="w-8 text-line" />
          GetAd
        </Link>

        {(user?.role === 'creator' || user?.role === 'admin') && <MenuLink to="/">Questi</MenuLink>}
        {user?.role === 'company' && <MenuLink to="/moji-questi">Moji questi</MenuLink>}
        {user?.role === 'admin' && <MenuLink to="/admin/questi">Pregled questov</MenuLink>}
        {user?.role === 'admin' && <MenuLink to="/admin/oddaje">Moderacija oddaj</MenuLink>}

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted">
                {user.display_name} ({roleNames[user.role]})
              </span>
              <button onClick={handleLogout} className="btn-outline">Odjava</button>
            </>
          ) : (
            <>
              <Link to="/prijava" className="btn-outline">Prijava</Link>
              <Link to="/registracija" className="btn">Registracija</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
