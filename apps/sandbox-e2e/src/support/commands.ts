declare namespace Cypress {
  interface Chainable<Subject> {
    getByDataRole(dataRole: string): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('getByDataRole', dataRole => {
  return cy.get(`[data-role="${dataRole}"]`);
});
