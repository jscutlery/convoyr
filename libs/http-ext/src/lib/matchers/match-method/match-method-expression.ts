import { HttpMethod } from '../../request';
import { Matcher } from '../matcher';

export type MatchMethodExpression = HttpMethod | HttpMethod[];
export type MethodMatcher = Matcher<MatchMethodExpression>;
