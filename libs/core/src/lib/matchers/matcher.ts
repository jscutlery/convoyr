export interface Matcher<TMatchExpression = any, TValue = any> {
  canHandle(matchExpression: TMatchExpression): boolean;
  handle(args: { matchExpression: TMatchExpression; value: TValue }): boolean;
}
