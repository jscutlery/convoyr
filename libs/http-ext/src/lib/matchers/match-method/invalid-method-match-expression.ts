export function invalidMethodMatchExpression(matchExpression) {
  return new Error(
    `InvalidMethodMatchExpression: ${JSON.stringify(
      matchExpression
    )} is an invalid method match expression.`
  );
}
