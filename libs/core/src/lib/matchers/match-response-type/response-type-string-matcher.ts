import { ResponseType } from '../../request';
import { isString } from '../../utils/is-string';
import { ResponseTypeMatcher } from './match-response-type-expression';

export const responseTypeStringMatcher: ResponseTypeMatcher = {
  canHandle(matchExpression) {
    return isString(matchExpression);
  },
  handle({
    value,
    matchExpression,
  }: {
    matchExpression: ResponseType;
    value: ResponseType;
  }) {
    return value === matchExpression;
  },
};
