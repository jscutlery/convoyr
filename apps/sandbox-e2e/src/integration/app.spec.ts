import { getGreeting } from '../support/app.po';

describe('sandbox', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to sandbox!');
  });
});
