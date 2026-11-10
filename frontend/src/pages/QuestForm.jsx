import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestImages from '../components/QuestImages.jsx';

const emptyForm = { title: '', description: '', requirements: '', reward_amount: '', deadline: '' };

// Obrazec za nov quest in urejanje osnutka (US-02, WF-03).
// Na poti /questi/nov ustvari quest, na poti /questi/:id/uredi ga ureja.
export default function QuestForm() {
  const { id } = useParams(); // pri novem questu je id undefined
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('draft');
  const [images, setImages] = useState([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Pri urejanju naložimo obstoječi quest v obrazec
  useEffect(() => {
    if (!id) {
      setForm(emptyForm);
      return;
    }
    fetch(`/api/quests/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setForm({
          title: data.title,
          description: data.description,
          requirements: data.requirements,
          reward_amount: data.reward_amount,
          deadline: data.deadline.slice(0, 10), // samo datum (LLLL-MM-DD)
        });
        setStatus(data.status);
        setImages(data.assets);
        setRejectionReason(data.rejection_reason);
      });
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Obrazec ima dva gumba: "Shrani osnutek" in "Pošlji v pregled".
  // V obeh primerih quest najprej shranimo, pri drugem ga nato še pošljemo v pregled.
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    const sendToReview = e.nativeEvent.submitter.name === 'review';

    const res = await fetch(id ? `/api/quests/${id}` : '/api/quests', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
    } else if (sendToReview) {
      const submitRes = await fetch(`/api/quests/${data.id}/submit`, { method: 'POST' });
      if (submitRes.ok) {
        navigate('/moji-questi');
      } else {
        setError((await submitRes.json()).error);
      }
    } else if (id) {
      setMessage('Osnutek shranjen.');
    } else {
      navigate(`/questi/${data.id}/uredi`); // po ustvarjanju nadaljujemo z urejanjem
    }
  }

  if (status !== 'draft') {
    return <p>Quest ni več osnutek, zato ga ni mogoče urejati.</p>;
  }

  return (
    <div>
      <h1 className="font-hand text-4xl font-bold mb-4">{id ? 'Urejanje questa' : 'Nov quest'}</h1>
      {rejectionReason && <p className="text-red-400 mb-4">Admin je quest zavrnil: {rejectionReason}</p>}

      <div className="grid md:grid-cols-[3fr_2fr] gap-4 items-start">
        <form onSubmit={handleSubmit} className="card flex flex-col gap-3">
          <label className="font-semibold">
            Naslov
            <input name="title" value={form.title} onChange={handleChange} required className="input" />
          </label>

          <label className="font-semibold">
            Opis
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input" />
          </label>

          <label className="font-semibold">
            Zahteve
            <textarea name="requirements" value={form.requirements} onChange={handleChange} required rows={4} className="input" />
          </label>

          <div className="flex gap-4">
            <label className="font-semibold flex-1">
              Nagrada (€)
              <input name="reward_amount" type="number" min="1" step="0.01" value={form.reward_amount} onChange={handleChange} required className="input" />
            </label>
            <label className="font-semibold flex-1">
              Rok (vsaj 7 dni)
              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required className="input" />
            </label>
          </div>

          {error && <p className="text-red-400">{error}</p>}
          {message && <p className="text-accent">{message}</p>}

          <div className="flex gap-3">
            <button type="submit" name="save" className="btn-outline">
              Shrani osnutek
            </button>
            <button type="submit" name="review" className="btn">
              Pošlji v pregled
            </button>
          </div>
        </form>

        {/* Slike lahko dodamo šele, ko quest obstaja v bazi */}
        {id ? (
          <QuestImages questId={id} images={images} setImages={setImages} />
        ) : (
          <p className="text-muted">Referenčne slike lahko dodaš, ko osnutek shraniš.</p>
        )}
      </div>
    </div>
  );
}
