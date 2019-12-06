export function addMinutes(minutes: number, fromDate: Date = new Date()) {
  return new Date(fromDate.valueOf() + minutes * 24 * 60);
}

export function addHours(hours: number, fromDate: Date = new Date()) {
  return new Date(fromDate.valueOf() + hours * 60 * 60 * 1000);
}

export function addDays(days: number, fromDate: Date = new Date()): Date {
  return new Date(fromDate.valueOf() + 24 * 60 * 60 * days);
}
