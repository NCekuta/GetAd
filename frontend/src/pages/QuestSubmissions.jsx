import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { statusNames } from '../questStatus.js';

// Odobrene oddaje questa in izbor zmagovalca (US-07, WF-04)
export default function QuestSubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quest, setQuest] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null); // oddaja, za katero je odprto potrditveno okno
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/quests/${id}`)
      .then((res) => res.json())
      .then(setQuest);
    fetch(`/api/quests/${id}/submissions`)
      .then((res) => res.json())
      .then(setSubmissions);
  }, [id]);

  async function confirmWinner() {
    setError('');
    const res = await fetch(`/api/quests/${id}/winner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission_id: selected.id }),
    });
    if (res.ok) {
      navigate(`/questi/${id}`); // zmagovalec je prikazan na strani questa
    } else {
      setError((await res.json()).error);
      setSelected(null);
    }
  }

  if (!quest) return <p>Nalagam ...</p>;

  return (
    <div>
      <div className="flex items-start mb-4">
        <div>
          <span className="chip">{statusNames[quest.status]}</span>
          <h1 className="font-hand text-4xl font-bold">Oddaje: {quest.title}</h1>
        </div>
        <p className="ml-auto font-hand text-4xl font-bold text-accent">{quest.reward_amount} €</p>
      </div>

      {quest.status === 'open' && <p className="mb-4">Zmagovalca boš lahko izbral po izteku roka.</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {submissions.length === 0 && <p>Ni odobrenih oddaj.</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {submissions.map((s) => (
          <div key={s.id} className="card !p-0 overflow-hidden">
            <video src={`/api/submissions/${s.id}/video`} controls className="w-full bg-black" />
            <div className="p-3">
              <h2 className="font-bold">{s.title}</h2>
              <p className="text-sm text-muted">{s.creator.display_name} · AI orodje: {s.ai_tool}</p>
              <p className="text-sm whitespace-pre-line mt-1">{s.description}</p>

              {quest.status === 'judging' && (
                <button onClick={() => setSelected(s)} className="btn w-full mt-3">
                  Izberi zmagovalca
                </button>
              )}
              {quest.winner?.id === s.id && <p className="mt-3 font-bold text-accent">Zmagovalec</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Potrditveno okno pred izbiro (WF-04) */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="card !p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Potrdi zmagovalca?</h2>
            <p className="mb-1">Zmagovalna oddaja: <strong>{selected.title}</strong> ({selected.creator.display_name})</p>
            <p className="text-muted mb-4">Izbire ni mogoče razveljaviti.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelected(null)} className="btn-outline">
                Prekliči
              </button>
              <button onClick={confirmWinner} className="btn">
                Potrdi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
