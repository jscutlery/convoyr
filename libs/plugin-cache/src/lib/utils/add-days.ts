export function addDays(fromDate: Date = new Date(), days: number): Date {
  return new Date(fromDate.valueOf() + 24 * 60 * 60 * days);
}
