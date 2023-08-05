describe('Correlation', () => {
  const email = 'new_account@gmail.com';
  const password = 'Wujas;123';

  const dataSheetColumn = '/description/name[pol]';
  const relationSheetColumn = 'Nazwa';
  const numberOfExpectedMatches = 43;

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

    cy.get('.loadFiles__input').first().selectFile('./cypress/e2e/files/idosell_zrzut_towarow.csv', {
      action: 'drag-drop'
    });
    cy.get('.loadFiles__input').last().selectFile('./cypress/e2e/files/triplex_bez_naglowka.csv', {
      action: 'drag-drop'
    });

    cy.wait(5000); // wait because large files loading

    cy.contains('Przejdź do korelacji rekordów').click();
    cy.get('.btn--correlationViewPicker:nth-of-type(2)').click();
    cy.get('.btn--autoMatch').click();
    cy.get('.btn--addPriority').click();

    cy.get('.priorities__item__condition__select').first().select(dataSheetColumn);
    cy.get('.priorities__item__condition__select').last().select(relationSheetColumn);
    cy.get('.input--matchThreshold').clear().type('60')

    cy.get('.btn--startAutoMatch').click();

    cy.intercept({
      method: 'POST',
      url: 'http://localhost:5000/correlate'
    }).as('correlateRequest')

    cy.wait('@correlateRequest', {
      responseTimeout: 1000 * 60 * 60 // 1 hour
    }).then((interception) => {
      cy.get('.select__btn').first().click();

      cy.get('.btn--correlationViewPicker:nth-of-type(3)>.fileNameInfo').should('contain.text', `Liczba rekordów: ${numberOfExpectedMatches}`);
    });
  });
})
