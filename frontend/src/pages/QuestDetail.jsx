import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { statusNames } from '../questStatus.js';
import { timeLeft } from '../timeLeft.js';
import SubmissionForm from '../components/SubmissionForm.jsx';
import MySubmission from '../components/MySubmission.jsx';
import QuestCover from '../components/QuestCover.jsx';

// Stran questa: opis, zahteve, nagrada, rok in slike (US-04, WF-02)
export default function QuestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
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
      <div className="flex flex-wrap items-start gap-4 mb-6">
        <div>
          <span className="chip">{statusNames[quest.status]}</span>
          <h1 className="font-hand text-4xl font-bold">{quest.title}</h1>
          <p className="text-muted">{quest.company.name}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-hand text-4xl font-bold text-accent">{quest.reward_amount} €</p>
          {/* Pri odprtem questu preostali čas do roka (US-06), sicer datum roka */}
          <p className="text-muted">
            {quest.status === 'open'
              ? `še ${timeLeft(quest.deadline)}`
              : `rok ${new Date(quest.deadline).toLocaleDateString('sl-SI')}`}
          </p>
        </div>
      </div>

      {/* Zmagovalec po izboru (US-07) */}
      {quest.winner && (
        <p className="card !border-accent mb-4">
          Zmagovalec: <strong>{quest.winner.title}</strong> ({quest.winner.creator.display_name})
        </p>
      )}

      {/* Lastnik questa lahko pogleda odobrene oddaje in izbere zmagovalca */}
      {quest.company.user_id === user.id && quest.status !== 'draft' && quest.status !== 'in_review' && (
        <Link to={`/questi/${quest.id}/oddaje`} className="btn mb-4">
          {quest.status === 'judging' ? 'Izberi zmagovalca' : 'Oddaje'}
        </Link>
      )}

      <div className="grid md:grid-cols-[3fr_2fr] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <section className="card">
            <h2 className="font-hand font-bold text-xl mb-1">Opis</h2>
            <p className="whitespace-pre-line">{quest.description}</p>
          </section>

          <section className="card">
            <h2 className="font-hand font-bold text-xl mb-1">Zahteve</h2>
            <p className="whitespace-pre-line">{quest.requirements}</p>
          </section>

          {/* Brez referenčnih slik pokažemo privzeto ilustracijo */}
          {quest.assets.length === 0 && <QuestCover quest={quest} className="h-48" />}

          {quest.assets.length > 0 && (
            <section className="card">
              <h2 className="font-hand font-bold text-xl mb-2">Referenčne slike</h2>
              <div className="grid grid-cols-3 gap-2">
                {quest.assets.map((img) => (
                  <a key={img.id} href={`/api/quests/${quest.id}/images/${img.id}`} target="_blank">
                    <img src={`/api/quests/${quest.id}/images/${img.id}`} alt={img.original_name} className="w-full h-28 object-cover rounded-lg" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Desni stolpec samo za ustvarjalca: njegova oddaja ali obrazec za oddajo */}
        {user.role === 'creator' && <CreatorPanel quest={quest} onChange={(s) => setQuest({ ...quest, my_submission: s })} />}
      </div>
    </div>
  );
}

// Oddaja ustvarjalca, sporočilo o poteku roka ali obrazec za oddajo
function CreatorPanel({ quest, onChange }) {
  if (quest.my_submission) {
    return <MySubmission submission={quest.my_submission} questOpen={quest.status === 'open'} onChange={onChange} />;
  }

  if (quest.status !== 'open') {
    return <p className="card">Rok za oddajo je potekel.</p>;
  }

  return <SubmissionForm questId={quest.id} onSubmitted={onChange} />;
}
