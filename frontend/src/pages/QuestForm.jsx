import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const emptyForm = { title: '', description: '', requirements: '', reward_amount: '', deadline: '' };

// Obrazec za nov quest in urejanje osnutka (US-02, WF-03).
// Na poti /questi/nov ustvari quest, na poti /questi/:id/uredi ga ureja.
export default function QuestForm() {
  const { id } = useParams(); // pri novem questu je id undefined
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('draft');
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
      });
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const res = await fetch(id ? `/api/quests/${id}` : '/api/quests', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Urejanje questa' : 'Nov quest'}</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded p-4 flex flex-col gap-3">
        <label className="font-semibold">
          Naslov
          <input name="title" value={form.title} onChange={handleChange} required className="block w-full border rounded p-2 font-normal" />
        </label>

        <label className="font-semibold">
          Opis
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="block w-full border rounded p-2 font-normal" />
        </label>

        <label className="font-semibold">
          Zahteve
          <textarea name="requirements" value={form.requirements} onChange={handleChange} required rows={4} className="block w-full border rounded p-2 font-normal" />
        </label>

        <div className="flex gap-4">
          <label className="font-semibold flex-1">
            Nagrada (€)
            <input name="reward_amount" type="number" min="1" step="0.01" value={form.reward_amount} onChange={handleChange} required className="block w-full border rounded p-2 font-normal" />
          </label>
          <label className="font-semibold flex-1">
            Rok (vsaj 7 dni)
            <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required className="block w-full border rounded p-2 font-normal" />
          </label>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-700">{message}</p>}

        <button type="submit" className="self-start border-2 border-gray-800 rounded px-4 py-2 font-semibold hover:bg-gray-100">
          Shrani osnutek
        </button>
      </form>
    </div>
  );
}
