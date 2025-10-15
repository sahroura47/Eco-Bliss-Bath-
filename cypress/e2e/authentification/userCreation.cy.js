describe('inscription nouvel utilisateur', () => {
    beforeEach(() => {
        cy.visit('/register');
    });
    // le formulaire est visible
    it('le formulaire est bien visible', () => {
        cy.get('[data-cy=register-form]').should('be.visible');
        cy.get('[data-cy=register-input-lastname]').should('exist').and('be.empty');
        cy.get('[data-cy=register-input-firstname]').should('exist').and('be.empty');
        cy.get('[data-cy=register-input-email]').should('exist').and('be.empty');
        cy.get('[data-cy=register-input-password]').should('exist').and('be.empty');
        cy.get('[data-cy=register-input-password-confirm]').should('exist').and('be.empty');
    });

    it('pas de création de compte si les champs sont vides', () => {
        cy.get('[data-cy=register-submit]').click();
        cy.get('[data-cy=register-errors]').should('be.visible').and('not.be.empty');
        cy.get('[data-cy=register-input-lastname]').should('have.class', 'ng-invalid');
        cy.get('[data-cy=register-input-firstname]').should('have.class', 'ng-invalid');
        cy.get('[data-cy=register-input-email]').should('have.class', 'ng-invalid');
        cy.get('[data-cy=register-input-password]').should('have.class', 'ng-invalid');
        cy.get('[data-cy=register-input-password-confirm]').should('have.class', 'ng-invalid');
    });
    it('test des scénarios inscription', () => {
        cy.fixture('registerPageData.json').then((scenarios) => {
            scenarios.forEach((scenario) => {
                const fileds = [
                    { selector: '[data-cy=register-input-lastname]', value: scenario.data.lastname },
                    { selector: '[data-cy=register-input-firstname]', value: scenario.data.firstname },
                    { selector: '[data-cy=register-input-email]', value: scenario.data.email },
                    { selector: '[data-cy=register-input-password]', value: scenario.data.password },
                    { selector: '[data-cy=register-input-password-confirm]', value: scenario.data.passwordConfirm }
                ];

                fileds.forEach(({ selector, value }) => {
                    cy.get(selector).clear();
                    if (value && value.trim() !== "") {
                        cy.get(selector).type(value);
                    }
                });
                cy.get('[data-cy=register-submit]').click();
                cy.url().should('include', '/');

                if (scenario.expectedError) {
                    cy.get('[data-cy=register-errors]')
                        .should('be.visible')
                }
            });

            cy.reload();
        });
    });
});