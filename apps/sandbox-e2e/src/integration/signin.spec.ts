import { getGreeting } from '../support/app.po';

describe('sandbox', () => {
  before(() => cy.visit('/'));

  it('should land on signin', () => {
    cy.url().should('include', '/signin');
  });
});
