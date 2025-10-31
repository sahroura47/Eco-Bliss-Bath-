describe('tests de suppression de produits du panier', () => {
    const apiURL = 'http://localhost:8081';
    const fakeToken = 'fake-jwt-token';
    it('vider le panier pour un utilisateur qui a un seul produit', () => {
        cy.fixture('order-one-product.json').then((order) => {
            cy.fixture('loginData.json').then((data) => {
                const line = order.orderLines[0];
                const product = line.product;

                cy.intercept('POST', `${apiURL}/login`, {
                    statusCode: 200,
                    body: {
                        token: fakeToken
                    }
                }).as('login');
                cy.intercept('GET', `${apiURL}/me`, {
                    statusCode: 200,
                    body: {
                        id: order.id,
                        firstname: order.firstname,
                        lastname: order.lastname
                    }
                }).as('getUser');
                cy.intercept('GET', `${apiURL}/orders`, {
                    statusCode: 200,
                    body: order
                }).as('getOrder');
                cy.intercept('DELETE', `${apiURL}/orders/*/delete`, (req) => {
                    req.reply({
                        statusCode: 200,
                        body: { success: true }
                    });
                }).as('deleteOrder');
                cy.visit('/login');
                const user = data.validUserCartOne;
                cy.get('[data-cy=login-input-username]').type(user.username);
                cy.get('[data-cy=login-input-password]').type(user.password);
                cy.get('[data-cy=login-submit]').click();
                cy.url().should('include', '/');

                cy.get('[data-cy=nav-link-cart]').click();
                cy.url().should('include', '/cart');

                cy.wait(['@getUser', '@getOrder']);

                cy.get('[data-cy=cart-line-delete]').first().click();
                cy.wait('@deleteOrder');
                cy.get('[data-cy=cart-empty]').should('be.visible').and('contain', order.message);
                cy.get('[data-cy=cart-total]').should('not.exist');
            });

        });
    });
    it('supprimer un ou plusieurs produits du panier d`un utilisateur qui a plusieurs produits au panier', () => {
        cy.fixture('order-multi-products.json').then((order) => {
            cy.fixture('loginData.json').then((data) => {
                const line = order.orderLines[0];
                const product = line.product;

                cy.intercept('POST', `${apiURL}/login`, {
                    statusCode: 200,
                    body: {
                        token: fakeToken
                    }
                }).as('login');
                cy.intercept('GET', `${apiURL}/me`, {
                    statusCode: 200,
                    body: {
                        id: order.id,
                        firstname: order.firstname,
                        lastname: order.lastname
                    }
                }).as('getUser');
                cy.intercept('GET', `${apiURL}/orders`, {
                    statusCode: 200,
                    body: order
                }).as('getOrder');
                cy.intercept('DELETE', `${apiURL}/orders/*/delete`, (req) => {
                    const newOrder = {
                        ...order,
                        orderLines: order.orderLines.slice(1),
                    }

                    req.reply({
                        statusCode: 200,
                        body: newOrder
                    });
                }).as('deleteOrder');
                cy.visit('/login');
                const user = data.validData;

                cy.get('[data-cy=login-input-username]').type(user.username);
                cy.get('[data-cy=login-input-password]').type(user.password);
                cy.get('[data-cy=login-submit]').click();
                cy.url().should('include', '/');

                cy.get('[data-cy=nav-link-cart]').click();
                cy.url().should('include', '/cart');

                cy.wait(['@getUser', '@getOrder']);
                // on vérifie les éléments du panier avant suppression
                const initialProducts = order.orderLines.map(line => ({
                    name: line.product.name,
                    price: line.product.price,
                    quantity: line.quantity,
                    description: line.product.description,
                    total: line.quantity * line.product.price

                }));
                const firstProduct = initialProducts[0];
                cy.get('[data-cy=cart-line-delete]').first().click();
                cy.wait('@deleteOrder');
            
                const remainingProducts = initialProducts.slice(1);
                cy.get('[data-cy=cart-line-name]').should('have.length', remainingProducts.length);
                // on vérifie que le premier produit est bien supprimé

                cy.get('[data-cy=cart-line-name]').each(($el) => {
                    expect($el.text().trim()).to.not.equal(firstProduct.name);
                });
            });
        });

    })
});
