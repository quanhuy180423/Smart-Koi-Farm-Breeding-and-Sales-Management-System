export function formatKoiAge(birthDate?: string | null): string {
  if (!birthDate) return "—";
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return "—";

  const now = new Date();
  const ms = now.getTime() - birth.getTime();
  if (ms < 0) return "0 tuần";

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30.436875; // average month
  const year = day * 365.2425; // average year

  if (ms < month) {
    // show weeks
    const weeks = Math.floor(ms / week);
    if (weeks <= 0) return "0 tuần";
    return `${weeks} tuần`;
  }

  if (ms < year) {
    const months = Math.floor(ms / month);
    return `${months} tháng`;
  }

  // compute fractional years with one decimal place
  const yearsExact = ms / year;
  // if it's a whole number, show without decimal; otherwise show one decimal
  if (Math.abs(yearsExact - Math.round(yearsExact)) < 1e-9) {
    return `${Math.round(yearsExact)} năm`;
  }
  return `${yearsExact.toFixed(1)} năm`;
}
