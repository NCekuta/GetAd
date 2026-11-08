import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Stran ne obstaja</h1>
      <Link to="/" className="text-blue-600 hover:underline">Nazaj na začetek</Link>
    </div>
  );
}
