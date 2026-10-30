// Kalkulator "ile tracisz": wszystkie liczby pochodzą z suwaków odwiedzającego.

const WEEKS_PER_MONTH = 52 / 12;
const HOURS_PER_DAY = 8;

const num = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0);

export function lostTime({ inquiries, minutes, reportHours, rate }) {
  const weekly = (num(inquiries) * num(minutes)) / 60 + num(reportHours);
  const monthly = weekly * WEEKS_PER_MONTH;
  return {
    weekly,
    monthly,
    days: monthly / HOURS_PER_DAY,
    money: monthly * num(rate),
  };
}
