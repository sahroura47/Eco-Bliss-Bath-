describe('tests d`api panier', () => {
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
    it('on récupére le panier d`un utilisateur connecté (cas succès)', () => {
        cy.request({
            method: 'GET',
            url: `${apiURL}/orders`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.be.eq(200);
            const body = response.body;
            expect(body).to.have.property('id');
            expect(body).to.have.property('validated', false);
            expect(body).to.have.property('orderLines');
            expect(body.orderLines).to.be.an('array').and.not.be.empty;

            // le premier élément dans le panier
            const firstLine = body.orderLines[0];
            expect(firstLine).to.have.property('id');
            expect(firstLine).to.have.property('quantity');

            //structure du produit 

            const product = firstLine.product;
            expect(product).to.have.all.keys('id', 'name', 'description', 'price', 'picture');
            expect(product.name).to.be.a('string');
            expect(product.price).to.be.a('number');
            expect(product.picture).to.be.a('string').and.to.contain('http');
        });
    });
    it('récupère le panier vide d`un utilisateur connecté ( cas échec)', () => {
        cy.fixture('loginData.json').then((data) => {
            const user = data.validUserEmptyCart;
            cy.request('POST', `${apiURL}/login`, {
                username: user.username,
                password: user.password
            }).then((response) => {
                expect(response.status).to.be.eq(200);
                token = response.body.token;
                cy.request({
                    method: 'GET',
                    url: `${apiURL}/orders`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.be.eq(404);
                    const body = response.body;
                    const bodyString = JSON.stringify(body);
                    expect(bodyString.includes("Not Found") || bodyString.includes("Aucune commande en cours"));
                });
            });
        });

    });
});