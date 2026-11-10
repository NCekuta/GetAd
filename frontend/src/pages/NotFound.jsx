import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1 className="font-hand text-4xl font-bold mb-2">Stran ne obstaja</h1>
      <Link to="/" className="text-accent hover:underline">Nazaj na začetek</Link>
    </div>
  );
}
