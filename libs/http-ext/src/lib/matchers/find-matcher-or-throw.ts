import { Matcher } from './matcher';

export function findMatcherOrThrow({
  matchExpression,
  matcherList,
  errorFactory
}: {
  matchExpression: any;
  matcherList: Matcher[];
  errorFactory: (matchExpression: any) => Error;
}) {
  const matcher = matcherList.find(_matcher =>
    _matcher.canHandle(matchExpression)
  );
  if (matcher == null) {
    throw errorFactory(matchExpression);
  }
  return matcher;
}
