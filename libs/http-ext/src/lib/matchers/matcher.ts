export interface MatcherArgs {
  [key: string]: any;
}

export interface Matcher<TMatchExpression = any> {
  canHandle(matchExpression: TMatchExpression): boolean;
  handle(args: { matchExpression: TMatchExpression } & MatcherArgs): boolean;
}
