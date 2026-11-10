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
      <form onSubmit={handleSave} className="bg-white border rounded p-4 flex flex-col gap-3">
        <h2 className="font-bold text-lg">Uredi oddajo</h2>
        <label className="font-semibold">
          Naslov
          <input name="title" value={form.title} onChange={handleChange} required className="block w-full border rounded p-2 font-normal" />
        </label>
        <label className="font-semibold">
          Opis
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="block w-full border rounded p-2 font-normal" />
        </label>
        <label className="font-semibold">
          AI orodje
          <input name="ai_tool" value={form.ai_tool} onChange={handleChange} required className="block w-full border rounded p-2 font-normal" />
        </label>
        <p className="text-sm text-gray-600">Po shranjevanju gre oddaja ponovno v pregled.</p>
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700">Shrani</button>
          <button type="button" onClick={() => setEditing(false)} className="border rounded px-4 py-2 hover:bg-gray-100">Prekliči</button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white border rounded p-4">
      <h2 className="font-bold text-lg mb-1">Tvoja oddaja</h2>
      <video src={`/api/submissions/${submission.id}/video`} controls className="w-full rounded mb-2 bg-black" />
      <p className="font-semibold">{submission.title}</p>
      <p className="whitespace-pre-line">{submission.description}</p>
      <p className="text-sm text-gray-600">AI orodje: {submission.ai_tool}</p>
      <p className="mt-2">Stanje: {submissionStatusNames[submission.status]}</p>
      {submission.rejection_reason && <p className="text-red-600">Razlog: {submission.rejection_reason}</p>}
      {error && <p className="text-red-600">{error}</p>}

      {canChange && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => setEditing(true)} className="border rounded px-4 py-2 hover:bg-gray-100">Uredi</button>
          <button onClick={handleWithdraw} className="border border-red-600 text-red-600 rounded px-4 py-2 hover:bg-red-50">Umakni</button>
        </div>
      )}
    </div>
  );
}
