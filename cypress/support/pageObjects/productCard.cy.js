const { productCard } = require("../../e2e/HomePage/productCard.cy");

describe('vérifie la visibilité des cartes produits', () => {
    beforeEach(() => {
        const newLocal = 'http://localhost:4200/#/';
        cy.visit(newLocal);
    });
    it('chaque carte produit est visible correctement', () => {
        cy.get('[data-cy=product-home]').then(($cards) => {
            const count = $cards.length;
            for (let i = 0; i < count; i++) {
                cy.get('[data-cy=product-home]').eq(i).then(($card) => {
                    const card = new productCard($card);
                    card.getImage().should('be.visible');
                    card.getName().should('be.visible');
                    card.getIngredients().should('be.visible');
                    card.getPrice().should('be.visible');
                });
            }
        });
    });
});
