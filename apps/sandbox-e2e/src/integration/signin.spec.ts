import { signIn } from '../support/signin.po';

describe('signin', () => {
  before(() => cy.visit('/'));

  it('should be landing page', () => {
    cy.url().should('include', '/signin');
  });

  describe('when signed in', () => {
    before(() => signIn());

    it('should redirect to bikes', () => {
      cy.url().should('include', '/bikes');
    });
  });
});
