import { OriginMatchExpression } from './origin-match-expression';

export interface OriginMatcher {
  canHandle(matchExpression: OriginMatchExpression): boolean;
  handle(args: {
    origin: string;
    matchExpression: OriginMatchExpression;
  }): boolean;
}
