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

        cy.fixture('orderLinesData.json').then((orderLinesIds) => {
            const orderLineId = orderLinesIds[0];
            const newQuantity = 3;

            cy.request({
                method: 'PUT',
                url: `${apiURL}/orders/${orderLineId}/change-quantity`,
                headers: { Authorization: `Bearer ${token}` },
                body: { quantity: newQuantity },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200);

                cy.request({
                    method: 'GET',
                    url: `${apiURL}/orders`,
                    headers: { Authorization: `Bearer ${token}` }
                }).then((cartResponse) => {
                    const body = cartResponse.body;
                    const updatedLine = body.orderLines.find(line => line.id === orderLineId);
                    expect(updatedLine).to.exist;
                    expect(updatedLine.quantity).to.eq(newQuantity);
                });
            });
        });
    });

});