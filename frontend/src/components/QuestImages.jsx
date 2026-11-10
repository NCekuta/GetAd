import { useState } from 'react';

const MAX_IMAGES = 3;

// Referenčne slike questa (US-02, WF-03): prikaz, dodajanje in brisanje.
// images je seznam slik iz baze, setImages ga posodobi v nadrejeni komponenti.
export default function QuestImages({ questId, images, setImages }) {
  const [error, setError] = useState('');

  // Sliko naložimo takoj, ko jo uporabnik izbere
  async function handleUpload(e) {
    const file = e.target.files[0];
    e.target.value = ''; // da lahko isto datoteko izbere ponovno
    if (!file) return;
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`/api/quests/${questId}/images`, { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) {
      setImages([...images, data]);
    } else {
      setError(data.error);
    }
  }

  async function handleDelete(imageId) {
    const res = await fetch(`/api/quests/${questId}/images/${imageId}`, { method: 'DELETE' });
    if (res.ok) {
      setImages(images.filter((img) => img.id !== imageId));
    }
  }

  return (
    <div className="card">
      <h2 className="font-hand font-bold text-xl mb-2">Referenčne slike</h2>

      {images.length < MAX_IMAGES && (
        <label className="block border-[1.5px] border-dashed border-muted/50 rounded-lg p-4 text-center text-muted cursor-pointer hover:border-accent hover:text-accent">
          Dodaj sliko (JPG ali PNG, do 5 MB, največ {MAX_IMAGES})
          <input type="file" accept=".jpg,.jpeg,.png" onChange={handleUpload} className="hidden" />
        </label>
      )}

      {error && <p className="text-red-400 mt-2">{error}</p>}

      <div className="grid grid-cols-3 gap-2 mt-3">
        {images.map((img) => (
          <div key={img.id} className="text-center">
            <img src={`/api/quests/${questId}/images/${img.id}`} alt={img.original_name} className="w-full h-24 object-cover rounded-lg" />
            <button type="button" onClick={() => handleDelete(img.id)} className="text-sm text-red-400 hover:underline">
              Odstrani
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
