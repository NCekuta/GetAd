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
        <h1 className="font-hand text-4xl font-bold">Moji questi</h1>
        <Link to="/questi/nov" className="btn ml-auto">
          Nov quest
        </Link>
      </div>

      {error && <p className="text-red-400 mb-2">{error}</p>}
      {quests.length === 0 && <p>Nimaš še nobenega questa.</p>}

      <div className="flex flex-col gap-3">
        {quests.map((quest) => (
          <div key={quest.id} className="card">
            <div className="flex items-center gap-4">
              <Link to={`/questi/${quest.id}`} className="font-hand font-bold text-xl hover:underline">{quest.title}</Link>
              <span className="chip">{statusNames[quest.status]}</span>
              <span className="ml-auto text-sm text-muted">
                {quest.reward_amount} € · rok {new Date(quest.deadline).toLocaleDateString('sl-SI')}
              </span>
            </div>

            {/* Preostali čas do roka pri odprtem questu (US-06) */}
            {quest.status === 'open' && <p className="text-sm mt-2">Do roka: {timeLeft(quest.deadline)}</p>}

            {/* Razlog, če je admin quest zavrnil (US-03) */}
            {quest.rejection_reason && (
              <p className="text-red-400 mt-2">Zavrnjen: {quest.rejection_reason}</p>
            )}

            {quest.status === 'draft' && (
              <div className="flex gap-3 mt-3">
                <Link to={`/questi/${quest.id}/uredi`} className="btn-outline">
                  Uredi
                </Link>
                <button onClick={() => sendToReview(quest.id)} className="btn">
                  Pošlji v pregled
                </button>
              </div>
            )}

            {/* Objavljen quest: ogled odobrenih oddaj in izbor zmagovalca (US-07) */}
            {['open', 'judging', 'closed'].includes(quest.status) && (
              <Link to={`/questi/${quest.id}/oddaje`} className="btn-outline mt-3">
                {quest.status === 'judging' ? 'Izberi zmagovalca' : 'Oddaje'}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
