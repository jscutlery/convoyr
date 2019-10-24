import { Matcher } from '../matcher';
import { MatchOriginPredicate } from './origin-predicate-matcher';

export type OriginMatchExpression =
  | string
  | string[]
  | RegExp
  | MatchOriginPredicate;
export type OriginMatcher = Matcher<OriginMatchExpression, string>;
