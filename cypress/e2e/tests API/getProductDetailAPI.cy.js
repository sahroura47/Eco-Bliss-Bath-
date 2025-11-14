describe('test de detail de produit API', () => {
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

    it('récupérer le détail de produits selon l`id', () => {
        cy.fixture('productIds.json').then((productIds) => {
            productIds.forEach((productId)=>{
                cy.request({
                    method: 'GET',
                    url: `${apiURL}/products/${productId}`,
                    headers: {Authorization: `Bearer ${token}`},
                    failOnStatusCode: false
                }).then((response)=>{
                    expect(response.status, `status pour id ${productId}`).to.eq(200);
                    const product= response.body;
                    expect(product).to.be.an('object');
                    expect(product).to.have.property('id', productId);
                    expect(product).to.have.property('name').and.to.be.a('string');
                    expect(product).to.have.property('availableStock').and.to.be.a('number');
                    expect(product).to.have.property('skin').and.to.be.a('string');
                    expect(product).to.have.property('aromas').and.to.be.a('string');
                    expect(product).to.have.property('ingredients').and.to.be.a('string');
                    expect(product).to.have.property('description').and.to.be.a('string');
                    expect(product).to.have.property('price').and.to.be.a('number');
                    expect(product).to.have.property('picture').and.to.be.a('string');
                    expect(product).to.have.property('varieties').and.to.be.a('number');
                })
            })
        })


    })
})