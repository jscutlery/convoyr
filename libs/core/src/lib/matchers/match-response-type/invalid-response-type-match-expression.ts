export function invalidResponseTypeMatchExpression(matchExpression) {
  return new Error(
    `InvalidResponseTypeMatchExpression: ${JSON.stringify(
      matchExpression
    )} is an invalid origin match expression.`
  );
}
