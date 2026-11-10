import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { timeLeft } from '../timeLeft.js';

// Domača stran: seznam odprtih questov (US-04, WF-01)
export default function Home() {
  const { user, loading } = useAuth();
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    if (!user) return; // seznam vidijo samo prijavljeni uporabniki
    fetch('/api/quests')
      .then((res) => res.json())
      .then(setQuests);
  }, [user]);

  if (loading) return <p>Nalagam ...</p>;

  if (!user) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-2">GetAd</h1>
        <p className="mb-4">Tekmovanja v AI video oglasih. Podjetja objavijo quest, ustvarjalci oddajo video in se potegujejo za nagrado.</p>
        <p>
          Za ogled questov se <Link to="/prijava" className="underline">prijavi</Link> ali{' '}
          <Link to="/registracija" className="underline">ustvari račun</Link>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Odprti questi</h1>
      {quests.length === 0 && <p>Ni questov.</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {quests.map((quest) => (
          <Link key={quest.id} to={`/questi/${quest.id}`} className="bg-white border rounded overflow-hidden hover:shadow">
            {/* Prva referenčna slika kot naslovna slika kartice */}
            {quest.assets.length > 0 ? (
              <img src={`/api/quests/${quest.id}/images/${quest.assets[0].id}`} alt="" className="w-full h-36 object-cover" />
            ) : (
              <div className="w-full h-36 bg-gray-200" />
            )}
            <div className="p-3">
              <h2 className="font-bold">{quest.title}</h2>
              <p className="text-sm text-gray-600">{quest.company.name}</p>
              <div className="flex mt-2">
                <span className="font-bold">{quest.reward_amount} €</span>
                <span className="ml-auto text-sm">še {timeLeft(quest.deadline)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
