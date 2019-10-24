export interface Matcher<TMatchExpression = any, TExpression = any> {
  canHandle(matchExpression: TMatchExpression): boolean;
  handle(args: {
    matchExpression: TMatchExpression;
    expression: TExpression;
  }): boolean;
}
