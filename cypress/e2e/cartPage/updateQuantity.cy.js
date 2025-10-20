describe('tests de changement de quantité dans le panier', () => {
    const apiURL = 'http://localhost:8081';
    const fakeToken = 'fake-jwt-token';
    it('update de quantité pour l`utilisateur qui a un seul produit au panier', () => {
        cy.fixture('order-one-product.json').then((order) => {
            const line = order.orderLines[0];
            const product = line.product;
            const newQuantity = 4;

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
            cy.intercept('PUT', `${apiURL}/orders/*/change-quantity`, (req) => {
                const updatedOrder = {
                    ...order,
                    orderLines: [
                        {
                            ...line,
                            quantity: newQuantity
                        }
                    ]
                };
                req.reply({
                    statusCode: 200,
                    body: updatedOrder
                })
            }).as('updateQuantity')

            cy.visit('/login');
            cy.fixture('loginData.json').then((data) => {
                const user = data.validUserCartOne;
                cy.get('[data-cy=login-input-username]').type(user.username);
                cy.get('[data-cy=login-input-password]').type(user.password);
                cy.get('[data-cy=login-submit]').click();
                cy.url().should('include', '/');
                cy.get('[data-cy=nav-link-cart]').click();
                cy.url().should('include', '/cart');

                cy.wait(['@getUser', '@getOrder']);


                const newLineTotal = Number(product.price) * newQuantity;

                // on modifie la quantité

                cy.get('[data-cy=cart-line-quantity]').clear().type(newQuantity).blur();
                cy.wait('@updateQuantity');


                // on vérifie le changement de total de la ligne

                cy.get('[data-cy=cart-line-total]').should('contain', `${newLineTotal.toFixed(2).replace('.', ',')} €`);

                // on vérifie le total du panier
                cy.get('[data-cy=cart-total]').should('contain', `${newLineTotal.toFixed(2).replace('.', ',')} €`);
            });
        });
    });
    it('update de quantité pour l`utilisateur qui a plusiers produits au panier', () => {
        cy.fixture('order-multi-products.json').then((order) => {
            const line = order.orderLines[0];
            const product = line.product;
            const newQuantity = 3;
            const newLineTotal = Number(product.price) * newQuantity;

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
            cy.intercept('PUT', `${apiURL}/orders/*/change-quantity`, (req) => {
                const updatedOrder = {
                    ...order,
                    orderLines: [
                        {
                            ...line,
                            quantity: newQuantity
                        }
                    ]
                };
                req.reply({
                    statusCode: 200,
                    body: updatedOrder
                })
            }).as('updateQuantity')

            cy.visit('/login');
            cy.fixture('loginData.json').then((data) => {
                const user = data.validData;
                cy.get('[data-cy=login-input-username]').type(user.username);
                cy.get('[data-cy=login-input-password]').type(user.password);
                cy.get('[data-cy=login-submit]').click();
                cy.url().should('include', '/');
                cy.get('[data-cy=nav-link-cart]').click();
                cy.url().should('include', '/cart');

                cy.wait(['@getUser', '@getOrder']);


                const newLineTotal = Number(product.price) * newQuantity;
                cy.get('[data-cy=cart-line-quantity]').first().clear().type(newQuantity).blur();
                cy.wait('@updateQuantity');


                // on vérifie le changement de total de la ligne

                cy.get('[data-cy=cart-line-total]').should('contain', `${newLineTotal.toFixed(2).replace('.', ',')} €`);

                // on vérifie le total du panier
                cy.get('[data-cy=cart-total]').should('contain', `${newLineTotal.toFixed(2).replace('.', ',')} €`);
            })
        });
    });
});