export function formatDateStable(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function compareDates(a: string | Date, b: string | Date): number {
  const timeA = typeof a === "string" ? new Date(a).getTime() : a.getTime();
  const timeB = typeof b === "string" ? new Date(b).getTime() : b.getTime();
  if (timeA < timeB) return -1;
  if (timeA > timeB) return 1;
  return 0;
}
