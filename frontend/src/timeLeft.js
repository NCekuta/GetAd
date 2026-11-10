const HOUR = 60 * 60 * 1000; // ena ura v milisekundah

// Preostali čas do roka v obliki "3 d 5 h" (US-06)
export function timeLeft(deadline) {
  const ms = new Date(deadline) - new Date();
  if (ms <= 0) return 'rok je potekel';

  const days = Math.floor(ms / (24 * HOUR));
  const hours = Math.floor(ms / HOUR) % 24;
  return `${days} d ${hours} h`;
}
