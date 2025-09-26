describe('review page test-UI', () => {
    context('utilisateur non connecté', () => {
        beforeEach(() => {
            localStorage.removeItem('user');
            cy.visit('/reviews');
            cy.fixture('reviewPageData.json').as('reviewData');

        });
        it('affiche le message de connexion', () => {
            cy.get('[data-cy=review-form]').should('not.exist');
            cy.get('@reviewData').then((reviewData) => {
                cy.contains(reviewData.loginPrompt).should('be.visible');
            })
        });
    });
    it('affiche la section avis', () => {
        // on vérifie au moins un avis est présent dans la page // 
        cy.get('[data-cy=review-detail]').first().should('be.visible');
        cy.get('[data-cy=reviews-average]').should('exist').and('be.visible');
        cy.get('[data-cy=reviews-number]').should('exist').and('be.visible');

        // on vérifie chaque avis // 
        cy.get('[data-cy=review-detail]').each(($review) => {
            cy.wrap($review).find('[data-cy=review-title]').should('exist').and('not.empty');
            cy.wrap($review).find('[data-cy=review-note] img').should('have.length', 5);
            cy.wrap($review).find('[data-cy=review-comment]').should('exist').and('not.empty');
        });
    });
});
context('utilisateur connecté', () => {
    beforeEach(() => {
        localStorage.setItem('user', 'fake-jwt-token');
        cy.visit('/reviews');
        cy.fixture('reviewPageData.json').as('reviewData');
        cy.get('@reviewData').then((reviewData) => {
            cy.contains(reviewData.loginPrompt).should('not.exist');
        })
    });
    it('affiche le formulaire et pas le message de connexion', () => {
        cy.get('[data-cy=review-form]').should('be.visible');
        cy.get('@reviewData').then((reviewData) =>{
        cy.contains(reviewData.loginPrompt).should('not.exist');
        })
    });
});


