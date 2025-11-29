describe('test UI page produit selon id ', () => {
    let products;
    before(() => {
        cy.fixture('productIds.json').then((ids) => {
        });
        cy.request('GET', 'http://localhost:8081/products').then((response) => {
            expect(response.status).to.eq(200);
            products = response.body;
        })
    });
    it(' vérifie chaque page produit par ID', () => {
        products.forEach((product) => {
            cy.visit(`/products/${product.id}`);

            //vérifier la section principale //
            cy.get('#product-detail').should('be.visible');
            // vérifier l'image produit // 
            cy.get('[data-cy=detail-product-img]').should('be.visible')
                .and('have.attr', 'src')
                .and('match', /^https?:\/\//);

            // infos produit //
            cy.get('[data-cy=detail-product-name]').should('be.visible').and('not.be.empty');
            cy.get('[data-cy=detail-product-description]').should('be.visible').and('not.be.empty');
            cy.get('[data-cy=detail-product-skin]').should('be.visible').and('not.be.empty');
            cy.get('[data-cy=detail-product-aromas]').should('be.visible').and('not.be.empty');
            cy.get('[data-cy=detail-product-ingredients]').should('be.visible').and('not.be.empty');
            // prix & quantité & bouton ajouter // 
            cy.get('[data-cy=detail-product-price]').should('contain', '€');
            cy.get('[data-cy=detail-product-add]').should('exist');
            cy.get('[data-cy=detail-product-quantity]').should('be.visible');
        });
    });
});