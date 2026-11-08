import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

// Zaščita strani na frontendu: neprijavljene preusmeri na prijavo,
// uporabnikom z napačno vlogo pokaže sporočilo.
// Uporaba: <RequireRole roles={['company']}><MojiQuesti /></RequireRole>
// (Pravo zaščito izvaja backend, to je samo za prijaznejši prikaz.)
export default function RequireRole({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Nalagam ...</p>;
  if (!user) return <Navigate to="/prijava" />;
  if (roles && !roles.includes(user.role)) {
    return <p className="text-red-600">Nimaš dostopa do te strani.</p>;
  }
  return children;
}
