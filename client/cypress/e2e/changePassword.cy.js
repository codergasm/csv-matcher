describe('Change password', () => {
  it('Change password', () => {
    const oldPassword = 'Wujas;123';
    const newPassword = 'Wujas;1234';
    const email = 'new_account@gmail.com';

    // Login
    cy.visit('/zaloguj-sie');

    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type(oldPassword);

    cy.get('.btn--submitForm').click();

    cy.url().should('include', '/home');

    // Change password
    cy.visit('/zmien-haslo');
    cy.get('input')
        .then((items) => {
          cy.get(items[0]).type(oldPassword);
          cy.get(items[1]).type(newPassword);
          cy.get(items[2]).type(newPassword);

          cy.get('.btn--submitForm').click();

          cy.get('.afterRegister').should('exist');
        });

    // Logout
    cy.get('.header__profileImage').click();
    cy.get('button.dropdownMenu__item').click();

    // Try to login with new password
    cy.visit('/zaloguj-sie');

    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type(oldPassword);
    cy.get('.btn--submitForm').click();

    cy.get('.error').should('exist');

    // Login with new password
    cy.get('input[type=email]').clear().type(email);
    cy.get('input[type=password]').clear().type(newPassword);
    cy.get('.btn--submitForm').click();

    cy.url().should('include', '/home');

    // Change password back to old
    cy.visit('/zmien-haslo');
    cy.get('input')
        .then((items) => {
          cy.get(items[0]).type(newPassword);
          cy.get(items[1]).type(oldPassword);
          cy.get(items[2]).type(oldPassword);

          cy.get('.btn--submitForm').click();

          cy.get('.afterRegister').should('exist');
        });
  });
})
