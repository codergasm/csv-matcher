describe('Files edition', () => {
  const email = 'sajmon0031@gmail.com';
  const password = 'Wujas;123';

  const newName1 = 'nowa_nazwa';
  const newName2 = 'nowa_nazwa_enter';

  beforeEach(() => {
    cy.session('Login user', () => {
      cy.visit('/zaloguj-sie');

      cy.get('input[type=email]').type(email);
      cy.get('input[type=password]').type(password);
      cy.get('.btn--submitForm').click();

      cy.url().should('include', '/home');
    }, {
      cacheAcrossSpecs: true
    });
  })

  it('Add new file', () => {
    cy.visit('/pliki');

    cy.get('.input--addNewFile').selectFile('./cypress/e2e/files/file.csv', {
      action: 'drag-drop'
    });

    cy.get('.bottomInfo').should('exist');
  });

  it('Change file name with button click', () => {
    cy.visit('/pliki');

    cy.get('.teamTable:nth-of-type(2) .btn--editSchema').last().click();
    cy.get('.input--schemaName--edit').clear().type(newName1);
    cy.get('.teamTable:nth-of-type(2) .btn--editSchema').last().click();
    cy.get('.teamTable:nth-of-type(2) .sheet__header__cell:first-of-type>span').last().should('contain.text', newName1);
  });

  it('Change file name with enter press', () => {
    cy.visit('/pliki');

    cy.get('.teamTable:nth-of-type(2) .btn--editSchema').last().click();
    cy.get('.input--schemaName--edit').clear().type(newName2 + '{enter}');
    cy.get('.teamTable:nth-of-type(2) .sheet__header__cell:first-of-type>span').last().should('contain.text', newName2);
  });

  it('Assign file to team', () => {
    cy.visit('/pliki');

    cy.get('.teamTable:nth-of-type(2) .btn--ownership').last().click();
    cy.contains('Przypisz').click();

    cy.get('.afterRegister__header').should('exist');
    cy.get('.afterRegister__header').should('contain.text', 'Plik został przypisany do zespołu');
  });

  it('Delete file', () => {
    cy.visit('/pliki');

    cy.get('.teamTable:nth-of-type(3) .btn--action:last-of-type').last().click();
    cy.get('.btn--leaveTeam').click();

    cy.get('.afterRegister__header').should('exist');
  });
})
