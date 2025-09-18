describe('vérifie la visibilité des cartes produits', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/#/products');
    });
    it('vérifie que chaque carte contient tous les éléments', () => {
        cy.get('[data-cy=product]').then(($cards) => {
            const count = $cards.length;
            for (let i = 0; i < count; i++) {
                cy.get('[data-cy=product]').eq(i).within(() => {
                    cy.get('[data-cy=product-picture]').should('be.visible');
                    cy.get('[data-cy=product-name]').should('be.visible');
                    cy.get('[data-cy=product-ingredients]').should('be.visible');
                    cy.get('[data-cy=product-price]').should('be.visible');
              

                // on vérifie la redirection des liens //
                cy.get('[data-cy=product-link]')
                    .invoke('attr', 'ng-reflect-router-link')
                    .then((link) => {
                        const expectedPath = link.replace(',', '/');
                        cy.get('[data-cy=product-link]').click();
                        cy.url().should('include', expectedPath);
                    });
                      });
                cy.go('back');
            }
        });
    });
});