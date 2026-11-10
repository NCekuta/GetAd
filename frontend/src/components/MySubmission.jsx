import { useState } from 'react';
import { submissionStatusNames } from '../questStatus.js';

// Oddaja ustvarjalca na strani questa (US-04): prikaz, urejanje in umik do roka.
// onChange pokličemo s posodobljeno oddajo.
export default function MySubmission({ submission, questOpen, onChange }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: submission.title,
    description: submission.description,
    ai_tool: submission.ai_tool,
  });
  const [error, setError] = useState('');

  // Spreminjati je mogoče samo do roka in samo oddajo, ki ni zavrnjena ali umaknjena
  const canChange = questOpen && (submission.status === 'pending' || submission.status === 'approved');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Pošlje zahtevek na backend in ob uspehu posodobi oddajo
  async function send(url, method, body) {
    setError('');
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      setEditing(false);
      onChange(data);
    } else {
      setError(data.error);
    }
  }

  function handleSave(e) {
    e.preventDefault();
    send(`/api/submissions/${submission.id}`, 'PUT', form);
  }

  function handleWithdraw() {
    if (window.confirm('Ali res želiš umakniti oddajo? Ponovna oddaja ne bo mogoča.')) {
      send(`/api/submissions/${submission.id}/withdraw`, 'POST', {});
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="card flex flex-col gap-3">
        <h2 className="font-hand font-bold text-xl">Uredi oddajo</h2>
        <label className="font-semibold">
          Naslov
          <input name="title" value={form.title} onChange={handleChange} required className="input" />
        </label>
        <label className="font-semibold">
          Opis
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input" />
        </label>
        <label className="font-semibold">
          AI orodje
          <input name="ai_tool" value={form.ai_tool} onChange={handleChange} required className="input" />
        </label>
        <p className="text-sm text-muted">Po shranjevanju gre oddaja ponovno v pregled.</p>
        {error && <p className="text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="btn">Shrani</button>
          <button type="button" onClick={() => setEditing(false)} className="btn-outline">Prekliči</button>
        </div>
      </form>
    );
  }

  return (
    <div className="card">
      <h2 className="font-hand font-bold text-xl mb-1">Tvoja oddaja</h2>
      <video src={`/api/submissions/${submission.id}/video`} controls className="w-full rounded mb-2 bg-black" />
      <p className="font-semibold">{submission.title}</p>
      <p className="whitespace-pre-line">{submission.description}</p>
      <p className="text-sm text-muted">AI orodje: {submission.ai_tool}</p>
      <p className="mt-2">Stanje: {submissionStatusNames[submission.status]}</p>
      {submission.rejection_reason && <p className="text-red-400">Razlog: {submission.rejection_reason}</p>}
      {error && <p className="text-red-400">{error}</p>}

      {canChange && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => setEditing(true)} className="btn-outline">Uredi</button>
          <button onClick={handleWithdraw} className="btn-danger">Umakni</button>
        </div>
      )}
    </div>
  );
}
