import { OriginMatchExpression } from './origin-match-expression';
import { OriginMatcher } from './origin-matcher';

export function invalidOriginMatchExpression(matchExpression) {
  return new Error(
    `InvalidOriginMatchExpression: ${JSON.stringify(
      matchExpression
    )} is an invalid origin match expression.`
  );
}

export function findMatcherOrThrow({
  matchExpression,
  matcherList
}: {
  matchExpression: OriginMatchExpression;
  matcherList: OriginMatcher[];
}) {
  const matcher = matcherList.find(_matcher =>
    _matcher.canHandle(matchExpression)
  );
  if (matcher == null) {
    throw invalidOriginMatchExpression(matchExpression);
  }
  return matcher;
}
