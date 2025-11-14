describe('test API products', ()=>{
    const apiURL= 'http://localhost:8081';
    let token;

    beforeEach(()=>{
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

    it('récupérer les produits', ()=>{
        cy.request({
            method: 'GET',
            url: `${apiURL}/products`,
            headers: { Authorization: `Bearer ${token}`}
        }).then((response)=>{
            expect(response.status).to.eq(200);
            const product= response.body;
            expect(product).to.be.an('array').and.not.be.empty;
        });
    });
});