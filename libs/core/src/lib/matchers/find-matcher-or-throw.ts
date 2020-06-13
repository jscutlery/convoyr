import { Matcher } from './matcher';

export function invalidMatchExpressionError(matchExpression) {
  return new Error(
    `InvalidMatchExpression: ${JSON.stringify(
      matchExpression
    )} is not a valid match expression.`
  );
}

export function findMatcherOrThrow({
  matchExpression,
  matcherList,
  matcherError = invalidMatchExpressionError(matchExpression),
}: {
  matchExpression: any;
  matcherList: Matcher[];
  matcherError: Error;
}): Matcher<any, any> {
  const matcher = matcherList.find((_matcher) =>
    _matcher.canHandle(matchExpression)
  );

  if (matcher == null) {
    throw matcherError;
  }

  return matcher;
}
