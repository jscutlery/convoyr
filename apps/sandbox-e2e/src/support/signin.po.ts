export function signIn() {
  cy.getByDataRole('login')
    .clear()
    .type('demo');
  cy.getByDataRole('password')
    .clear()
    .type('demo');
  cy.getByDataRole('signin-submit-button').click();
}
