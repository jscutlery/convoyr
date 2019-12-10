export function addMinutes(minutes: number, fromDate: Date = new Date()) {
  return new Date(fromDate.valueOf() + 24 * 60 * minutes);
}

export function addHours(hours: number, fromDate: Date = new Date()) {
  return new Date(fromDate.valueOf() + 24 * 60 * 1000 * hours);
}

export function addDays(days: number, fromDate: Date = new Date()): Date {
  return new Date(fromDate.valueOf() + 24 * 60 * 60 * days);
}
