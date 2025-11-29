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
    it('suppression d`un produit du panier ( cas succès)', () => {
        cy.fixture('productIds.json').then((productIds) => {
            // ajout de produit au panier
            cy.wrap(productIds).each((productId) => {
                const productToAdd = { product: productId, quantity: 1 }

                cy.request({
                    method: 'PUT',
                    url: `${apiURL}/orders/add`,
                    headers: { Authorization: `Bearer ${token}` },
                    body: productToAdd,
                    failOnStatusCode: false
                }).then((addResponse) => {
                    expect(addResponse.status).to.be.eq(200);

                });
            });

            cy.request({
                method: 'GET',
                url: `${apiURL}/orders`,
                headers: { Authorization: `Bearer ${token}` },
                failOnStatusCode: false
            }).then((getResponse) => {
                const orderLines = getResponse.body.orderLines;
                cy.wrap(orderLines).each((line) => {
                    if (productIds.includes(line.product.id)) {

                        cy.request({
                            method: 'DELETE',
                            url: `${apiURL}/orders/${line.id}/delete`,
                            headers: { Authorization: `Bearer ${token}` },
                            failOnStatusCode: false
                        }).then((deleteResponse) => {
                            expect(deleteResponse.status).to.be.eq(200);


                            cy.request({
                                method: 'GET',
                                url: `${apiURL}/orders`,
                                headers: { Authorization: `Bearer ${token}` },
                                failOnStatusCode: false
                            }).then((cartResponse) => {
                                const remainingLines = cartResponse.body.orderLines;
                                productIds.forEach((id) => {
                                    const deletedLine = remainingLines.find(line => line.id === id);
                                    expect(deletedLine).to.not.exist
                                })
                            })
                        })
                    }
                })
            })
        })
    })


    // on vérifie que le produit supprimé n'est plus dans le panier









    it('suppression d`un produit du panier( erreur simulée)', () => {
        const invalidId = "produit-invalide";
        cy.request({
            method: 'DELETE',
            url: `${apiURL}/orders/${invalidId}/delete`,
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.be.oneOf([400, 404])
        });
    });
});
