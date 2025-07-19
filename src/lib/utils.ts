export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

export function getDayLabel(date: string | Date): string {
  const inputDate = typeof date === "string" ? new Date(date) : date;

  const today = new Date();
  const input = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );

  const diffDays = Math.floor(
    (input.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";

  return input.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

