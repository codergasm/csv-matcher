describe('Login', () => {
  it('Login', () => {
    cy.visit('/zaloguj-sie');

    cy.get('input[type=email]').type('new_account@gmail.com');
    cy.get('input[type=password]').type('Wujas;123');

    cy.get('.btn--submitForm').click();

    cy.url().should('include', '/home');
  });
})
