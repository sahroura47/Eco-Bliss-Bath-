describe('ajout au panier test d`api', () => {
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
    it('ajout du plusieurs produits au panier ( cas succès)', () => {
        cy.fixture('productIds.json').then((productIds) => {
            productIds.forEach((id) => {
                const productToAdd = { product: id, quantity: 1 }
                cy.then(() => {
                    cy.request({
                        method: 'PUT',
                        url: `${apiURL}/orders/add`,
                        headers: { Authorization: `Bearer ${token}` },
                        body: productToAdd,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.be.eq(200);
                        const body = response.body;

                        const addedLine = body.orderLines.find(line => line.product.id === id);
                        expect(addedLine).to.exist;
                        expect(addedLine.quantity).to.be.gte(1);

                    });
                });
            });
        });
    });
    it('ajout d`un produit au panier (cas échec)', () => {
        const invalidProduct = { product: 'produit-invalide', quantity: 1 };

        cy.request({
            method: 'PUT',
            url: `${apiURL}/orders/add`,
            headers: { Authorization: `Bearer ${token}` },
            body: invalidProduct,
            failOnStatusCode: false
        }).then((response) => {
            
            expect(response.status).to.be.oneOf([400, 404]);
        });

    })
});