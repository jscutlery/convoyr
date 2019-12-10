import * as ms from 'ms';
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

export function parseTtl(ttl: any) {
  if (ttl == null) {
    return null;
  }

  const ttlMicroseconds = ms(ttl);

  if (ttlMicroseconds == null) {
    throw invalidTtlError(ttl);
  }

  return ttlMicroseconds;
}

export function parseTtlUnit(ttl: any): TtlUnit | null {
  if (ttl == null) {
    return null;
  }
  const UNIT_POS = ttl.length - 1;
  const unit = ttl[UNIT_POS];

  checkTtlUnit(unit);

  return unit;
}
