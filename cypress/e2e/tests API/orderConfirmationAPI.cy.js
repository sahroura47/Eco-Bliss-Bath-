describe('test de confirmation de commande API', () => {
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

    it('confirmation de commande ( cas succès)', () => {
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
        cy.fixture('cartFormData.json').then((orderData) => {
            cy.request({
                method: 'POST',
                url: `${apiURL}/orders`,
                headers: { Authorization: `Bearer ${token}` },
                body: orderData,
                failOnStatusCode: false
            }).then((response) => {
                cy.log(response);
                expect(response.status).to.eq(200);
                const body = response.body;

                expect(body).to.have.property('id');
                expect(body).to.have.property('firstname', orderData.firstname);
                expect(body).to.have.property('lastname', orderData.lastname);
                expect(body).to.have.property('address', orderData.address);
                expect(body).to.have.property('zipCode', orderData.zipCode);
                expect(body).to.have.property('city', orderData.city);
            });
        });
    });
    it('test confirmation de commande (cas échoue)', () => {
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
        const invalidOrder = {
            firstname: "",
            lastname: "",
            address: "",
            zipCode: "00000",
            city: "Paris"
        };
        cy.request({
            method: 'POST',
            url: `${apiURL}/orders`,
            headers: { Authorization: `Bearer ${token}` },
            body: invalidOrder,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.be.oneOf([400, 422]);

            if (response.status !== 200) {
                expect(response.body).to.have.property('error');
            }
        });
    })
});