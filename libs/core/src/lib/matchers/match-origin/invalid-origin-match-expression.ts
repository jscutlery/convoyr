export function invalidOriginMatchExpression(matchExpression) {
  return new Error(
    `InvalidOriginMatchExpression: ${JSON.stringify(
      matchExpression
    )} is an invalid origin match expression.`
  );
}
