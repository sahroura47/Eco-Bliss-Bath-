describe('scenarios d`ajout des produits au panier', () => {
    let loginData;
    before(() => {
        // pour charger les identifiants valides pour les tests 
        cy.fixture('loginData.json').then((data) => {
            loginData = data.validData;
            // connexion via API et stockage du token
            cy.request('POST', 'http://localhost:8081/login', loginData)
                .then((res) => {
                    expect(res.status).to.eq(200);
                    window.localStorage.setItem('user', res.body.token);
                });
        });
        // on charge les IDs des produits à tester 


    });
    it('on vérifie le sélecteur quantité de chaque produit', () => {
        cy.fixture('productIds.json').then((productIds) => {
            cy.wrap(productIds).each((productId) => {
                cy.visit(`/products/${productId}`);

                cy.get('[data-cy=detail-product-quantity]')
                    .should('be.visible')
                    .and('have.attr', 'type', 'number');
                // on vérifie que la valeur est supérieure à 0 
                cy.get('[data-cy=detail-product-quantity]').should('have.value', '1');
                cy.get('[data-cy=detail-product-add]').should('exist');

                // on vérifie le comportement selon le stock //
                cy.request('GET', `http://localhost:8081/products/${productId}`).then((res) => {
                    const product = res.body;

                    if (product.availableStock > 0) {
                        cy.log(`✅ produit "${product.name}" a du stock (${product.availableStock})`);
                        // on change la quantité // 
                        cy.get('[data-cy=detail-product-quantity]')
                            .clear()
                            .type('2')
                            .should('have.value', '2');
                        // ajout au panier
                        cy.get('[data-cy=detail-product-add]').click();

                        // vérifie la redirection selon utilisateur connecté ou pas
                        cy.url().then((url) => {
                            if (url.includes('/login')) {
                                cy.log('⚠️ utilisateur non connecté et redirigé vers la page de connexion');
                            } else if (url.includes('/cart')) {
                                cy.log('✅ utilisateur connecté et redirigé vers le panier');

                                // on vérifie le produit ajouté est bien dans le panier
                                cy.get('[data-cy=cart-empty]').should('not.exist');
                                cy.get('[data-cy=cart-line]').within(() => {
                                    cy.get('[data-cy=cart-line-name]').contains(product.name);
                                    cy.get('[data-cy=cart-line-quantity]').should('have.value', 2);
                                    cy.get('[data-cy=cart-line-total]').should('contain', (2 * product.price).toFixed(2));
                                });
                            } else {
                                throw new Error(`redirection inattendue: ${url}`);
                            }
                        })

                    }
                });
            });
        });
    });
});
