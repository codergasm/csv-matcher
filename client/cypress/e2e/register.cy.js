function generateRandomEmail() {
    let length = 10;
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let email = "";

    for(let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        email += charset.charAt(randomIndex);
    }

    email += "@example.com";

    return email;
}

describe('Register', () => {
    it('Register with random new email', () => {
        cy.visit('/zarejestruj-sie');

        cy.get('input[type=email]').type(generateRandomEmail());
        cy.get('input[type=password]').first().type('Wujas;123');
        cy.get('input[type=password]').last().type('Wujas;123');
        cy.get('.btn--check').click();

        cy.get('.btn--submitForm').click();

        cy.get('.afterRegister').should('exist');
    });

    it('Register with email that is already used', () => {
        cy.visit('/zarejestruj-sie');

        cy.get('input[type=email]').type('new_account@gmail.com');
        cy.get('input[type=password]').first().type('Wujas;123');
        cy.get('input[type=password]').last().type('Wujas;123');
        cy.get('.btn--check').click();

        cy.get('.btn--submitForm').click();

        cy.get('.error').should('exist');
        cy.get('.error').should('contain.text', 'Użytkownik o podanym adresie e-mail już istnieje');
    });

    it('Register with short password', () => {
        cy.visit('/zarejestruj-sie');

        cy.get('input[type=email]').type(generateRandomEmail());
        cy.get('input[type=password]').first().type('aa');
        cy.get('input[type=password]').last().type('aa');
        cy.get('.btn--check').click();

        cy.get('.btn--submitForm').click();

        cy.get('.error').should('exist');
        cy.get('.error').should('contain.text', 'Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną wielką literę oraz jedną cyfrę');
    });

    it('Register with not equal passwords', () => {
        cy.visit('/zarejestruj-sie');

        cy.get('input[type=email]').type(generateRandomEmail());
        cy.get('input[type=password]').first().type('Wujas;123');
        cy.get('input[type=password]').last().type('Wujas;223');
        cy.get('.btn--check').click();

        cy.get('.btn--submitForm').click();

        cy.get('.error').should('exist');
        cy.get('.error').should('contain.text', 'Podane hasła nie są identyczne');
    });

    it('Register with not accepting checkbox', () => {
        cy.visit('/zarejestruj-sie');

        cy.get('input[type=email]').type(generateRandomEmail());
        cy.get('input[type=password]').first().type('Wujas;123');
        cy.get('input[type=password]').last().type('Wujas;123');

        cy.get('.btn--submitForm').click();

        cy.get('.error').should('exist');
        cy.get('.error').should('contain.text', 'Akceptuj postanowienia polityki prywatności');
    });
})
