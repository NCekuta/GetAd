import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { timeLeft } from '../timeLeft.js';
import Doodle, { Scribble } from '../components/Doodle.jsx';
import QuestCover from '../components/QuestCover.jsx';

// Domača stran: predstavitev za neprijavljene, seznam odprtih questov za ustvarjalce in admina (US-04, WF-01)
export default function Home() {
  const { user, loading } = useAuth();
  const [quests, setQuests] = useState([]);

  const canSeeQuests = user?.role === 'creator' || user?.role === 'admin';

  useEffect(() => {
    if (!canSeeQuests) return;
    fetch('/api/quests')
      .then((res) => res.json())
      .then(setQuests);
  }, [canSeeQuests]);

  if (loading) return <p>Nalagam ...</p>;

  // Podjetje nima seznama vseh questov, samo svoje
  if (user?.role === 'company') return <Navigate to="/moji-questi" replace />;

  return (
    <div>
      <section className="flex flex-wrap items-center gap-8 pb-12">
        <div className="flex-1 min-w-72">
          <p className="font-hand text-xl text-muted">natečaji za AI video oglase</p>
          <h1 className="font-hand font-bold text-6xl leading-tight">{user ? 'Odprti questi' : 'GetAd'}</h1>
          <Scribble className="w-72 h-4 text-line mb-5" />
          <p className="text-lg text-muted max-w-lg">
            Podjetja objavijo quest, ustvarjalci z AI orodjem po svoji izbiri ustvarijo video in ga oddajo do roka.
            Zmagovalca izbere podjetje.
          </p>
          {!user && (
            <div className="flex gap-3 mt-6">
              <Link to="/registracija" className="btn">Ustvari račun</Link>
              <Link to="/prijava" className="btn-outline">Prijava</Link>
            </div>
          )}
        </div>
        <Doodle name="camera" className="w-72 text-line mx-auto" />
      </section>

      {user && (
        <>
          <h2 className="font-hand font-bold text-2xl mb-5">Vsi questi</h2>
          {quests.length === 0 && <p className="text-muted">Ni odprtih questov.</p>}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {quests.map((quest) => (
              <Link key={quest.id} to={`/questi/${quest.id}`} className="card flex flex-col gap-3 hover:border-accent">
                <QuestCover quest={quest} />
                <div>
                  <p className="text-sm text-muted">{quest.company.name}</p>
                  <h3 className="font-hand font-bold text-xl leading-snug">{quest.title}</h3>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-hand font-bold text-2xl text-accent">{quest.reward_amount} €</span>
                  <span className="chip">še {timeLeft(quest.deadline)}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
