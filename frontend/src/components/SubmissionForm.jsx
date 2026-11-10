import { useState } from 'react';

// Obrazec za oddajo videa na quest (US-04, WF-02).
// Po uspešni oddaji pokliče onSubmitted z novo oddajo.
export default function SubmissionForm({ questId, onSubmitted }) {
  const [form, setForm] = useState({ title: '', description: '', ai_tool: '' });
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setUploading(true);

    // Video in besedilna polja pošljemo skupaj kot multipart/form-data
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('ai_tool', form.ai_tool);
    formData.append('video', video);

    const res = await fetch(`/api/quests/${questId}/submissions`, { method: 'POST', body: formData });
    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      onSubmitted(data);
    } else {
      setError(data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">Oddaj video</h2>

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
        <input name="ai_tool" value={form.ai_tool} onChange={handleChange} required placeholder="npr. Sora, Runway, Veo" className="block w-full border rounded p-2 font-normal" />
      </label>

      <label className="font-semibold">
        Video (MP4, do 100 MB)
        <input type="file" accept="video/mp4" onChange={(e) => setVideo(e.target.files[0])} required className="block w-full border-2 border-dashed rounded p-3 font-normal" />
      </label>

      {error && <p className="text-red-600">{error}</p>}

      <button type="submit" disabled={uploading} className="bg-gray-800 text-white rounded p-2 font-semibold hover:bg-gray-700 disabled:opacity-50">
        {uploading ? 'Nalagam video ...' : 'Oddaj'}
      </button>
    </form>
  );
}
