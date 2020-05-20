import { Matcher } from '../matcher';
import { ResponseType } from '../../request';

export type ResponseTypeMatchExpression = ResponseType | ResponseType[];
export type ResponseTypeMatcher = Matcher<
  ResponseTypeMatchExpression,
  ResponseType
>;
