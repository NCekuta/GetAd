import Doodle from './Doodle.jsx';

// Ilustracije, ki jih pokažemo, ko quest nima referenčne slike
const defaultDoodles = ['can', 'bike', 'phone', 'mountain'];

// Naslovna slika questa: prva referenčna slika ali privzeta ilustracija.
// Ilustracijo izberemo po id-ju questa, da kartice niso vse enake.
export default function QuestCover({ quest, className = 'h-40' }) {
  if (quest.assets.length > 0) {
    return (
      <img
        src={`/api/quests/${quest.id}/images/${quest.assets[0].id}`}
        alt=""
        className={`w-full object-cover rounded-lg ${className}`}
      />
    );
  }

  return (
    <div className={`w-full flex items-center justify-center border-[1.5px] border-dashed border-muted/50 rounded-lg text-line ${className}`}>
      <Doodle name={defaultDoodles[quest.id % defaultDoodles.length]} className="w-40" />
    </div>
  );
}
