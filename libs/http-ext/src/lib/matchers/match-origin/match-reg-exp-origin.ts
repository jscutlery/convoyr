import { OriginMatchExpression } from './origin-match-expression';

export const matchRegExpOrigin = (
  origin: string,
  matcher: OriginMatchExpression
): boolean => matcher instanceof RegExp && matcher.test(origin);
