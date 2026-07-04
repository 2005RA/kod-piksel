// src/hooks/useCountdown.js
import { useEffect, useRef, useState } from 'react';

export function useCountdown(targetDate, onExpire) {
  const target      = targetDate ? new Date(targetDate).getTime() : null;
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const [label, setLabel] = useState(() => formatRemaining(target));

  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => {
      const next = formatRemaining(target);
      setLabel(next);
      if (next === null) {
        clearInterval(id);
        onExpireRef.current?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
    return label;

}

function formatRemaining(target) {
  if (!target) return null;
  const diff = Math.max(0, target - Date.now());
  if (diff <= 0) return null;

  const days  = Math.floor(diff / 864e5);
  const hours = Math.floor((diff % 864e5) / 36e5);
  const mins  = Math.floor((diff % 36e5) / 6e4);
  const secs  = Math.floor((diff % 6e4) / 1000);

  if (days > 0)  return `${days}g ${hours}s`;
  if (hours > 0) return `${hours}s ${mins}d`;
  return `${mins}d ${secs}s`;
}

export function getWeekEnd() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  const end = new Date(now);
  end.setDate(now.getDate() + daysUntilSunday);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
}