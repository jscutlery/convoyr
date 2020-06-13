import { RequestCondition } from '../../plugin';
import { findMatcherOrThrow } from '../find-matcher-or-throw';
import { invalidPathExpression } from './invalid-path-match-expression';
import { pathStringMatcher } from './method-string-matcher';

export const matchPath = (matchExpression: string): RequestCondition => ({
  request,
}): boolean => {
  const { url } = request;
  const { pathname } = new URL(url);

  const matcher = findMatcherOrThrow({
    matchExpression: matchExpression,
    matcherList: [pathStringMatcher],
    matcherError: invalidPathExpression(matchExpression),
  });

  return matcher.handle({
    matchExpression,
    value: pathname,
  });
};
