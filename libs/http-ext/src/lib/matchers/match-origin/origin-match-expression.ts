import { OriginMatchPredicate } from './match-predicate-origin';

export type OriginMatchExpression =
  | string
  | string[]
  | RegExp
  | OriginMatchPredicate;
