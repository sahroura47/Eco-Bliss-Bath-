describe('validation du formulaire', () => {
    beforeEach(() => {
        localStorage.setItem('user', 'fake-jwt-token');
        cy.visit('/reviews');
        cy.get('[data-cy=review-form]').should('be.visible');
        cy.fixture('reviewPageData.json').as('reviewData');
        cy.get('@reviewData').then((reviewData) => {
            cy.contains(reviewData.loginPrompt).should('not.exist');
        })
    });
    it('ne doit pas valider si tous les champs sont vides', () => {
        cy.get('[data-cy=review-submit]').click();
        // vérifier que les champs sont invalides //
        cy.get('[data-cy=review-input-title]').should('have.class', 'ng-invalid');
        cy.get('[data-cy=review-input-comment]').should('have.class', 'ng-invalid');
        cy.get('[data-cy=review-input-rating]').should('have.class', 'ng-invalid');
    });
    it('ne doit pas valider si un seul champs est rempli', () => {
        // boucle sur les scénarios du reviewData json // 
        cy.get('@reviewData').then((reviewData) => {
            reviewData.formScenarios.forEach((scenario, index) => {
                if (scenario.filled.title) cy.get('[data-cy=review-input-title]').clear().type(scenario.filled.title);
                if (scenario.filled.comment) cy.get('[data-cy=review-input-comment]').clear().type(scenario.filled.comment);
                if (scenario.filled.rating) {
                    const rating = Number(scenario.filled.rating);
                    for (let i = 1; i <= rating; i++) {
                        cy.get('[data-cy=review-input-rating-images] img').eq(i - 1).click();
                    }
                }
                cy.get('[data-cy=review-submit]').click();
                scenario.empty.forEach((field) => {
                    cy.get(`[data-cy=review-input-${field}]`).should('have.class', 'ng-invalid');
                });
                Object.keys(scenario.filled).forEach((field) => {
                    cy.get(`[data-cy=review-input-${field}]`).should('have.class', 'ng-valid');
                });
                cy.get('[data-cy=review-input-title]').clear();
                cy.get('[data-cy=review-input-comment]').clear();
            });
        });
    });
});
