import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statusNames } from '../questStatus.js';
import { timeLeft } from '../timeLeft.js';

// Seznam questov podjetja s stanjem in pošiljanjem v pregled (US-02)
export default function MyQuests() {
  const [quests, setQuests] = useState([]);
  const [error, setError] = useState('');

  function loadQuests() {
    fetch('/api/quests/mine')
      .then((res) => res.json())
      .then(setQuests);
  }

  useEffect(loadQuests, []);

  async function sendToReview(id) {
    setError('');
    const res = await fetch(`/api/quests/${id}/submit`, { method: 'POST' });
    if (res.ok) {
      loadQuests(); // osvežimo seznam, da se pokaže novo stanje
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">Moji questi</h1>
        <Link to="/questi/nov" className="ml-auto bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700">
          Nov quest
        </Link>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {quests.length === 0 && <p>Nimaš še nobenega questa.</p>}

      <div className="flex flex-col gap-3">
        {quests.map((quest) => (
          <div key={quest.id} className="bg-white border rounded p-4">
            <div className="flex items-center gap-4">
              <Link to={`/questi/${quest.id}`} className="font-bold text-lg hover:underline">{quest.title}</Link>
              <span className="text-sm bg-gray-100 border rounded px-2">{statusNames[quest.status]}</span>
              <span className="ml-auto text-sm text-gray-600">
                {quest.reward_amount} € · rok {new Date(quest.deadline).toLocaleDateString('sl-SI')}
              </span>
            </div>

            {/* Preostali čas do roka pri odprtem questu (US-06) */}
            {quest.status === 'open' && <p className="text-sm mt-2">Do roka: {timeLeft(quest.deadline)}</p>}

            {/* Razlog, če je admin quest zavrnil (US-03) */}
            {quest.rejection_reason && (
              <p className="text-red-600 mt-2">Zavrnjen: {quest.rejection_reason}</p>
            )}

            {quest.status === 'draft' && (
              <div className="flex gap-3 mt-3">
                <Link to={`/questi/${quest.id}/uredi`} className="border rounded px-3 py-1 hover:bg-gray-100">
                  Uredi
                </Link>
                <button onClick={() => sendToReview(quest.id)} className="bg-gray-800 text-white rounded px-3 py-1 hover:bg-gray-700">
                  Pošlji v pregled
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
