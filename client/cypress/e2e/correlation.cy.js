describe('Correlation', () => {
  const email = 'new_account@gmail.com';
  const password = 'Wujas;123';

  const dataSheetColumn = 'Kod';
  const relationSheetColumn = '/description/name[pol]';

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
  });

  it('Correlation', () => {
    cy.visit('/edytor-dopasowania');

    cy.get('.loadFiles__input').first().selectFile('./cypress/e2e/files/data_sheet.csv', {
      action: 'drag-drop'
    });
    cy.get('.loadFiles__input').last().selectFile('./cypress/e2e/files/relation_sheet.csv', {
      action: 'drag-drop'
    });

    cy.wait(5000); // wait because large files loading

    cy.contains('Przejdź do korelacji rekordów').click();
    cy.get('.btn--correlationViewPicker:nth-of-type(2)').click();
    cy.get('.btn--autoMatch').click();
    cy.get('.modal__label').contains('Pokrycie wartości z ark. 1 w ark. 2').click();
    cy.get('.btn--addPriority').click();

    cy.get('.priorities__item__condition__select').first().select(dataSheetColumn);
    cy.get('.priorities__item__condition__select').last().select(relationSheetColumn);

    cy.get('.btn--startAutoMatch').click();

    cy.wait(120000); // wait 2 minutes

    cy.get('.select__btn').first().click();
    cy.get('.select__menu__item__similarity').first().should('contain.text', '50 %');
  });
})