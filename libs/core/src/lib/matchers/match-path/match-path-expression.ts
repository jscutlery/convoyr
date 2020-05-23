import { HttpMethod } from '../../request';
import { Matcher } from '../matcher';

export type PathMatcher = Matcher<string, HttpMethod>;
