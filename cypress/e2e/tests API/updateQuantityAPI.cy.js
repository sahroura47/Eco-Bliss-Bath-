describe('test API panier, update quantity', () => {
    const apiURL = "http://localhost:8081";
    let token;

    beforeEach(() => {
        cy.fixture('loginData.json').then((data) => {
            const user = data.validData;
            cy.request('POST', `${apiURL}/login`, {
                username: user.username,
                password: user.password
            }).then((response) => {
                expect(response.status).to.be.eq(200);
                token = response.body.token;
            });
        });
    });

    it('mettre à jour la quantité d`un produit au panier', () => {
        cy.fixture('productIds.json').then((productIds) => {
            cy.wrap(productIds).each((productId) => {
                const productToAdd = { product: productId, quantity: 1 }

                cy.request({
                    method: 'PUT',
                    url: `${apiURL}/orders/add`,
                    headers: { Authorization: `Bearer ${token}` },
                    body: productToAdd,
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.be.eq(200);
                });

            }).then(() => {
                cy.request({
                    method: 'GET',
                    url: `${apiURL}/orders`,
                    headers: { Authorization: `Bearer ${token}` },
                    failOnStatusCode: false
                }).then((cartResponse) => {
                    const orderLines = cartResponse.body.orderLines;
                    // on choisi le premier élément dans le panier
                    const orderLineToUpdate = orderLines[0];
                    const newQuantity = 3;


                    cy.request({
                        method: 'PUT',
                        url: `${apiURL}/orders/${orderLineToUpdate.id}/change-quantity`,
                        headers: { Authorization: `Bearer ${token}` },
                        body: { quantity: newQuantity },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(200);

                        cy.request({
                            method: 'GET',
                            url: `${apiURL}/orders`,
                            headers: { Authorization: `Bearer ${token}` }
                        }).then((finalResponse) => {
                            const body = finalResponse.body;
                            const updatedLine = body.orderLines.find(line => line.id === orderLineToUpdate.id);
                            expect(updatedLine).to.exist;
                            expect(updatedLine.quantity).to.eq(newQuantity);
                        });
                    })

                });


            });
        });
    });
    it('mettre à jour la quantité d’un produit (échec, quantity invalide)', () => {

        it('mettre à jour la quantité d’un produit (échec, quantity invalide)', () => {
            // Ajouter un produit valide
            cy.fixture('productIds.json').then((productIds) => {
                const productId = productIds[0];

                cy.request({
                    method: 'PUT',
                    url: `${apiURL}/orders/add`,
                    headers: { Authorization: `Bearer ${token}` },
                    body: { product: productId, quantity: 1 }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    const addedLine = response.body.orderLines.find(line => line.product.id === productId);
                    expect(addedLine).to.exist;

                    const orderLineId = addedLine.id;

                    // Tentative de mise à jour avec quantity invalide
                    cy.request({
                        method: 'PUT',
                        url: `${apiURL}/orders/${orderLineId}/change-quantity`,
                        headers: { Authorization: `Bearer ${token}` },
                        body: { quantity: -5 },  // ❌ valeur invalide
                        failOnStatusCode: false  // nécessaire pour tester l’erreur
                    }).then((response) => {
                        // L’API doit renvoyer 400
                        expect(response.status).to.eq(400);

                        // Optionnel : vérifier le message d’erreur
                        if (typeof response.body === 'object') {
                            expect(response.body).to.have.property('error');
                        }
                    });
                });
            });
        });
        cy.fixture('productIds.json').then((productIds) => {
            const productId = productIds[0];

            cy.request({
                method: 'PUT',
                url: `${apiURL}/orders/add`,
                headers: { Authorization: `Bearer ${token}` },
                body: { product: productId, quantity: 1 }
            }).then((response) => {
                expect(response.status).to.eq(200);
                const addedLine = response.body.orderLines.find(line => line.product.id === productId);
                expect(addedLine).to.exist;

                const orderLineId = addedLine.id;

                cy.request({
                    method: 'PUT',
                    url: `${apiURL}/orders/${orderLineId}/change-quantity`,
                    headers: { Authorization: `Bearer ${token}` },
                    body: { quantity: -5 },
                    failOnStatusCode: false
                }).then((response) => {

                    expect(response.status).to.eq(400);
                });
            });
        });
    });

});