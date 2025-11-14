describe('suppression de produits du panier test d`api', () => {
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
    it('suppression dè un produit du panier', ()=>{
        cy.fixture('productIds.json').then((productIds)=>{
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
            productIds.forEach((id)=>{
                cy.then(()=>{
                    cy.request({
                        method: 'DELETE',
                        url: `${apiURL}/orders/{id}/delete`,
                        headers: { Authorization: `Bearer ${token}`},
                        failOnStatusCode: false
                    }).then((response)=>{
                        expect(response.status).to.be.eq(200);

                        // on vérifie que le produit supprimé n'est plus dans le panier

                        cy.request({
                            method:'GET',
                            url: `${apiURL}/orders`,
                            headers: {Authorization: `Bearer ${token}`},
                            failOnStatusCode: false
                        }).then((cartResponse)=>{
                            const body= cartResponse.body;
                            const deletedLine= body.orderLines.find(line => line.product.id === id);
                            expect(deletedLine).to.not.exist
                        });
                    });
                });

            });
        });
    });
});