import { useEffect, useState } from 'react';

// Zavihki na vrhu strani (WF-05): stanje oddaje in ime zavihka
const tabs = [
  { status: 'pending', label: 'Čaka' },
  { status: 'approved', label: 'Odobrene' },
  { status: 'rejected', label: 'Zavrnjene' },
];

// Moderacija oddaj (US-05, WF-05): admin odobri ali zavrne oddaje
export default function AdminSubmissions() {
  const [status, setStatus] = useState('pending');
  const [submissions, setSubmissions] = useState([]);

  // Ob menjavi zavihka naložimo oddaje z izbranim stanjem
  useEffect(() => {
    fetch(`/api/admin/submissions?status=${status}`)
      .then((res) => res.json())
      .then(setSubmissions);
  }, [status]);

  // Pregledano oddajo odstranimo s seznama
  function removeSubmission(id) {
    setSubmissions(submissions.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h1 className="font-hand text-4xl font-bold mb-4">Moderacija oddaj</h1>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            onClick={() => setStatus(tab.status)}
            className={status === tab.status ? 'btn' : 'btn-outline'}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {submissions.length === 0 && <p>Ni oddaj.</p>}

      <div className="flex flex-col gap-4">
        {submissions.map((s) => (
          <SubmissionReviewCard key={s.id} submission={s} onDone={() => removeSubmission(s.id)} />
        ))}
      </div>
    </div>
  );
}

// Kartica ene oddaje: video, podatki ter pri čakajočih še razlog in gumba
function SubmissionReviewCard({ submission, onDone }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // action je "approve" ali "reject"
  async function review(action) {
    setError('');
    const res = await fetch(`/api/admin/submissions/${submission.id}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      onDone();
    } else {
      setError((await res.json()).error);
    }
  }

  return (
    <div className="card grid md:grid-cols-[1fr_2fr_1fr] gap-4">
      <video src={`/api/submissions/${submission.id}/video`} controls className="w-full rounded bg-black" />

      <div>
        <h2 className="font-hand font-bold text-xl">{submission.title}</h2>
        <p className="text-sm text-muted">
          Quest: {submission.quest.title} · {submission.creator.display_name} · AI orodje: {submission.ai_tool}
        </p>
        <p className="whitespace-pre-line mt-1">{submission.description}</p>
        {submission.rejection_reason && <p className="text-red-400 mt-1">Razlog: {submission.rejection_reason}</p>}
      </div>

      {submission.status === 'pending' && (
        <div className="flex flex-col gap-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Razlog zavrnitve"
            rows={3}
            className="input"
          />
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => review('approve')} className="btn">
              Odobri
            </button>
            <button onClick={() => review('reject')} className="btn-outline">
              Zavrni
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
