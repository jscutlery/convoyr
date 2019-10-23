import { MatchMethodExpression } from './match-method-expression';

export function invalidMethodMatchExpression(
  matchExpression: MatchMethodExpression
) {
  return new Error(
    `InvalidMethodMatchExpression: ${JSON.stringify(
      matchExpression
    )} is an invalid method match expression.`
  );
}
