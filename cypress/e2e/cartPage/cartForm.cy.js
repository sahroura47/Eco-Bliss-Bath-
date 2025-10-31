describe('cart form tests', () => {
    const apiURL = 'http://localhost:8081';
    const fakeToken = 'fake-jwt-token';

    it('vérifier le fomulaire est présent', () => {
        cy.fixture('order-one-product.json').then((order) => {
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
                const user = data.validUserCartOne;
                cy.get('[data-cy=login-input-username]').type(user.username);
                cy.get('[data-cy=login-input-password]').type(user.password);
                cy.get('[data-cy=login-submit]').click();
                cy.url().should('include', '/');
            });

            cy.get('[data-cy=nav-link-cart]').click();
            cy.url().should('include', '/cart');

            cy.wait(['@getUser', '@getOrder']);
            cy.get('[data-cy=cart-form]', {timeout: 10000}).should('exist').and('be.visible');

            cy.fixture('cartFormData.json').then((customer) => {
                cy.log(customer);
                cy.get('[data-cy=cart-form]').within(() => {
                    cy.get('[data-cy=cart-input-lastname]').should('have.value', order.lastname);
                    cy.get('[data-cy=cart-input-firstname]').should('have.value', order.firstname);
                    cy.log('address:', customer.address);
                    cy.get('[data-cy=cart-input-address]').clear().type(customer.address).should('have.value', customer.address);
                    cy.get('[data-cy=cart-input-zipcode]').clear().type(customer.zipCode).should('have.value', customer.zipCode);
                    cy.get('[data-cy=cart-input-city]').clear().type(customer.city).should('have.value', customer.city);

                    // On simule la soumission
                    cy.intercept('POST', `${apiURL}/orders`, { statusCode: 200, body: { success: true } }).as('confirmOrder');
                    cy.get('[data-cy=cart-submit]').click();
                    cy.wait('@confirmOrder').its('response.statusCode').should('eq', 200);
                });
            });
        });

    })

});