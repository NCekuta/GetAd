import { useEffect, useState } from 'react';

// Domača stran – kasneje seznam odprtih questov (#14)
export default function Home() {
  const [backendOk, setBackendOk] = useState(null);

  // Preverimo, ali frontend doseže backend (prek Vite proxyja)
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setBackendOk(data.ok))
      .catch(() => setBackendOk(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Odprti questi</h1>
      <p>Seznam questov bo dodan kasneje.</p>
      <p className="mt-4 text-sm text-gray-500">
        Backend: {backendOk === null ? 'preverjam ...' : backendOk ? 'povezan' : 'ni dosegljiv'}
      </p>
    </div>
  );
}
