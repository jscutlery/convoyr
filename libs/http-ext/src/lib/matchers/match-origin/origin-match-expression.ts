import { MatchOriginPredicate } from './origin-predicate-matcher';

export type OriginMatchExpression =
  | string
  | string[]
  | RegExp
  | MatchOriginPredicate;
