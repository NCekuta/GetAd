// Ročno narisane ilustracije (SVG). Barvo prevzamejo iz besedila (currentColor),
// zato jih pobarvamo z razredom, npr. text-line.
const doodles = {
  can: (
    <>
      <path d="M66 24c0-4 28-5 28 0l2 52c0 6-32 6-32 0z" />
      <path d="M66 25c6 5 22 5 28-1M70 44c6 1 14 1 20-1M80 20l3-10 10 2" />
      <circle cx="124" cy="26" r="9" />
      <path d="M124 8v5M124 39v5M106 26h5M137 26h5M30 84c20-3 80-4 100-1" />
    </>
  ),
  bike: (
    <>
      <circle cx="50" cy="64" r="17" />
      <circle cx="110" cy="64" r="17" />
      <path d="M50 64l20-26h30l10 26M70 38l14 26h26M84 64L70 38M64 32h12M98 30h7l2 8M22 88c30-3 90-3 116 0" />
    </>
  ),
  phone: (
    <>
      <path d="M62 14c0-3 3-4 6-4h26c4 0 6 2 6 5l1 70c0 3-2 5-6 5H68c-4 0-6-2-6-5z" />
      <path d="M74 40l18 10-18 10zM76 18h10M118 32c6 4 6 13 0 17M126 25c10 8 10 23 0 31" />
    </>
  ),
  mountain: (
    <>
      <path d="M16 86l40-52 18 22 16-30 48 60z" />
      <path d="M50 42l6-8 7 9-6 2zM84 34l6-8 8 12-7-1zM118 20c5-2 10 2 13 0M104 30c4-2 8 1 11 0" />
    </>
  ),
  camera: (
    <>
      <path d="M40 72c0-7 4-11 11-11h108c7 0 11 4 11 11l1 60c0 7-4 10-11 10H51c-7 0-11-3-11-10z" />
      <path d="M171 88l45-23 1 76-46-22" />
      <circle cx="74" cy="38" r="22" />
      <circle cx="130" cy="36" r="24" />
      <circle cx="74" cy="38" r="6" />
      <circle cx="130" cy="36" r="7" />
      <path d="M62 100h22M62 113h44M226 26l4 10 10 4-10 4-4 10-4-10-10-4 10-4zM20 160c60-6 160-6 230-2" />
    </>
  ),
  logo: <path d="M4 8c0-2 1-3 3-3h11c2 0 3 1 3 3v13c0 2-1 3-3 3H7c-2 0-3-1-3-3zM21 12l6-3v13l-6-3M10 11l5 3-5 3z" />,
};

// Velikost risalne površine za posamezno ilustracijo
const viewBoxes = { camera: '0 0 260 180', logo: '0 0 30 30' };

export default function Doodle({ name, className }) {
  const viewBox = viewBoxes[name] || '0 0 160 100';
  return (
    <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {doodles[name]}
    </svg>
  );
}

// Počečkana črta pod naslovom ali aktivno povezavo
export function Scribble({ className }) {
  return (
    <svg viewBox="0 0 300 16" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M4 10C60 4 140 4 200 7s80 2 94-3" />
    </svg>
  );
}
