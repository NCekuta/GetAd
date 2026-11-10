import { useEffect, useState } from 'react';

// Admin pregled novih questov (US-03): odobritev ali zavrnitev z razlogom
export default function AdminQuests() {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    fetch('/api/admin/quests')
      .then((res) => res.json())
      .then(setQuests);
  }, []);

  // Pregledan quest odstranimo s seznama
  function removeQuest(id) {
    setQuests(quests.filter((q) => q.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pregled questov</h1>
      {quests.length === 0 && <p>Ni questov, ki bi čakali na pregled.</p>}

      <div className="flex flex-col gap-4">
        {quests.map((quest) => (
          <QuestReviewCard key={quest.id} quest={quest} onDone={() => removeQuest(quest.id)} />
        ))}
      </div>
    </div>
  );
}

// Kartica enega questa: levo vsebina, desno razlog in gumba (kot WF-05)
function QuestReviewCard({ quest, onDone }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // action je "approve" ali "reject"
  async function review(action) {
    setError('');
    const res = await fetch(`/api/admin/quests/${quest.id}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      onDone();
    } else {
      setError((await res.json()).error);
    }
  }

  return (
    <div className="bg-white border rounded p-4 grid md:grid-cols-[2fr_1fr] gap-4">
      <div>
        <h2 className="font-bold text-lg">{quest.title}</h2>
        <p className="text-sm text-gray-600 mb-2">
          {quest.company.name} · {quest.reward_amount} € · rok {new Date(quest.deadline).toLocaleDateString('sl-SI')}
        </p>
        <p className="whitespace-pre-line">{quest.description}</p>
        <h3 className="font-semibold mt-2">Zahteve</h3>
        <p className="whitespace-pre-line">{quest.requirements}</p>

        <div className="flex gap-2 mt-2">
          {quest.assets.map((img) => (
            <img key={img.id} src={`/api/quests/${quest.id}/images/${img.id}`} alt={img.original_name} className="h-20 border rounded" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Razlog zavrnitve"
          rows={3}
          className="border rounded p-2"
        />
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button onClick={() => review('approve')} className="bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700">
            Odobri
          </button>
          <button onClick={() => review('reject')} className="border-2 border-gray-800 rounded px-4 py-2 hover:bg-gray-100">
            Zavrni
          </button>
        </div>
      </div>
    </div>
  );
}
