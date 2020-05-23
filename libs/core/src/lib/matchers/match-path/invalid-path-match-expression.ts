export function invalidPathExpression(matchExpression) {
  return new Error(
    `InvalidPathMatchExpression: ${JSON.stringify(
      matchExpression
    )} is an invalid path expression.`
  );
}
