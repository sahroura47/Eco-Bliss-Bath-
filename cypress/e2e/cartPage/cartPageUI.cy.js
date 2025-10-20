describe('tests page panier UI', () => {
    const apiURL = 'http://localhost:8081';
    const fakeToken = 'fake-jwt-token';

    it('affiche le panier vide avec un message qui vient avec', () => {
        cy.fixture('order-empty.json').then((order) => {
            // on mock le login
            cy.intercept('POST', `${apiURL}/login`, {
                statusCode: 200,
                body: { token: fakeToken }
            }).as('login');
            // on mock /me pour récupérer l'utilisateur
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
            cy.visit('/login');

            cy.fixture('loginData.json').then((data) => {
                const user = data.validUserEmptyCart;
                cy.get('[data-cy=login-input-username]').type(user.username);
                cy.get('[data-cy=login-input-password]').type(user.password);
                cy.get('[data-cy=login-submit]').click();
                cy.url().should('include', '/');
            });

            cy.get('[data-cy=nav-link-cart]').click();
            cy.url().should('include', '/cart');

            cy.wait(['@getUser', '@getOrder']);

            cy.get('[data-cy=cart-line]').should('have.length', 0);
            // on vérifie que le message indiquant que le panier est vide est affiché
            cy.get('[data-cy=cart-empty]')
                .should('be.visible')
                .and('contain', order.message);

            cy.get('[data-cy=cart-total]').should('not.exist');

        });


    });
    it('affiche le panier avec un seul élément dans le panier', () => {
        cy.fixture('order-one-product.json').then((order) => {
            cy.intercept('POST', `${apiURL}/login`, {
                statusCode: 200,
                body: { token: fakeToken }
            });
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
                cy.get('[data-cy=cart-line]').should('have.length', 1);
                const line= order.orderLines[0];
                const product=line.product;
                const totalPrice= Number(product.price) * line.quantity;
                cy.get('[data-cy=cart-line-image]').should('have.attr', 'src').and('include', product.picture);
                cy.get('[data-cy=cart-line-name]').should('contain', product.name);
                cy.get('[data-cy=cart-line-description]').should('contain', product.description);
                cy.get('[data-cy=cart-line-total]').should('contain', `${totalPrice.toFixed(2).replace('.', ',')} €`);
                cy.get('[data-cy=cart-line-quantity]').should('have.value', line.quantity);
                // on vérifie le total
                const total= Number(product.price) * line.quantity;
                cy.get('[data-cy=cart-total]').should('contain', `${total.toFixed(2).replace('.', ',')} €`);

            });
        });

    });
    it('affiche le panier de l`utilisateur qui a plusieurs produits', ()=>{
         cy.fixture('order-multi-products.json').then((order) => {
            // on mock le login
            cy.intercept('POST', `${apiURL}/login`, {
                statusCode: 200,
                body: { token: fakeToken }
            }).as('login');
            // on mock /me pour récupérer l'utilisateur
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
            cy.visit('/login');

            cy.fixture('loginData.json').then((data) => {
                const user = data.validData;
                cy.get('[data-cy=login-input-username]').type(user.username);
                cy.get('[data-cy=login-input-password]').type(user.password);
                cy.get('[data-cy=login-submit]').click();
                cy.url().should('include', '/');
            });

            cy.get('[data-cy=nav-link-cart]').click();
            cy.url().should('include', '/cart');

            cy.wait(['@getUser', '@getOrder']);

            cy.get('[data-cy=cart-line]').should('have.length', order.orderLines.length);
            let totalPanier=0;
            order.orderLines.forEach((line, index) => {
                const product=line.product;
                const lineTotal= Number(product.price) * line.quantity;
                totalPanier += lineTotal;
                cy.get('[data-cy=cart-line]').eq(index).within(()=>{
                   cy.get('[data-cy=cart-line-image]').should('have.attr', 'src').and('include', product.picture);
                   cy.get('[data-cy=cart-line-name]').should('contain', product.name);
                   cy.get('[data-cy=cart-line-description]').should('contain', product.description);
                   cy.get('[data-cy=cart-line-total]').should('contain', `${Number(lineTotal).toFixed(2).replace('.', ',')} €` );
                   cy.get('[data-cy=cart-line-quantity]').should('have.value', line.quantity);
                });
            });
    })
});
});

