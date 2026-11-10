import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { statusNames } from '../questStatus.js';
import { timeLeft } from '../timeLeft.js';

// Stran questa: opis, zahteve, nagrada, rok in slike (US-04, WF-02)
export default function QuestDetail() {
  const { id } = useParams();
  const [quest, setQuest] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/quests/${id}`)
      .then((res) => res.json())
      .then((data) => (data.error ? setError(data.error) : setQuest(data)));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!quest) return <p>Nalagam ...</p>;

  return (
    <div>
      <div className="flex items-start mb-4">
        <div>
          <span className="text-sm border rounded-full px-2">{statusNames[quest.status]}</span>
          <h1 className="text-2xl font-bold">{quest.title}</h1>
          <p className="text-gray-600">{quest.company.name}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold">{quest.reward_amount} €</p>
          {/* Pri odprtem questu preostali čas do roka (US-06), sicer datum roka */}
          <p>
            {quest.status === 'open'
              ? `še ${timeLeft(quest.deadline)}`
              : `rok ${new Date(quest.deadline).toLocaleDateString('sl-SI')}`}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:w-3/5">
        <section className="bg-white border rounded p-4">
          <h2 className="font-bold text-lg mb-1">Opis</h2>
          <p className="whitespace-pre-line">{quest.description}</p>
        </section>

        <section className="bg-white border rounded p-4">
          <h2 className="font-bold text-lg mb-1">Zahteve</h2>
          <p className="whitespace-pre-line">{quest.requirements}</p>
        </section>

        {quest.assets.length > 0 && (
          <section className="bg-white border rounded p-4">
            <h2 className="font-bold text-lg mb-2">Referenčne slike</h2>
            <div className="grid grid-cols-3 gap-2">
              {quest.assets.map((img) => (
                <a key={img.id} href={`/api/quests/${quest.id}/images/${img.id}`} target="_blank">
                  <img src={`/api/quests/${quest.id}/images/${img.id}`} alt={img.original_name} className="w-full h-28 object-cover border rounded" />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
