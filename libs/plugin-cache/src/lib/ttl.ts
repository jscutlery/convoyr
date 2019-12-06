export type TtlUnit = 'd' | 'h' | 'm';

export function invalidTtlUnitError(unit: any) {
  return new Error(
    `InvalidTtlUnitError: ${JSON.stringify(unit)} is not a valid unit.`
  );
}

export function invalidTtlError(ttl: any) {
  return new Error(
    `InvalidTtlError: ${JSON.stringify(ttl)} is not a valid ttl.`
  );
}

export function checkTtlUnit(unit: any): void {
  const units: TtlUnit[] = ['d', 'h', 'm'];
  if (!units.includes(unit)) {
    throw invalidTtlUnitError(unit);
  }
}

export function checkTtl(ttl: any): void {
  if (!Number.isInteger(ttl)) {
    throw invalidTtlError(ttl);
  }
}

export function parseTtl(ttl: any) {
  if (ttl === null) {
    return null;
  }
  const UNIT_POS = ttl.length - 1;
  const rawTtl = parseInt(ttl.substring(0, UNIT_POS), 10);

  checkTtl(rawTtl);

  return rawTtl;
}

export function parseTtlUnit(ttl: any): TtlUnit | null {
  if (ttl === null) {
    return null;
  }
  const UNIT_POS = ttl.length - 1;
  const unit = ttl[UNIT_POS];

  checkTtlUnit(unit);

  return unit;
}
