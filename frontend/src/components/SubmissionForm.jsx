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
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3">
      <h2 className="font-hand font-bold text-xl">Oddaj video</h2>

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
        <input name="ai_tool" value={form.ai_tool} onChange={handleChange} required placeholder="npr. Sora, Runway, Veo" className="input" />
      </label>

      <label className="font-semibold">
        Video (MP4, do 100 MB)
        <input type="file" accept="video/mp4" onChange={(e) => setVideo(e.target.files[0])} required className="input border-dashed" />
      </label>

      {error && <p className="text-red-400">{error}</p>}

      <button type="submit" disabled={uploading} className="btn">
        {uploading ? 'Nalagam video ...' : 'Oddaj'}
      </button>
    </form>
  );
}
