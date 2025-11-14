describe('test de récupération de produits aléatoires de l`api', () => {
    const apiURL = "http://localhost:8081";
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

    it('récupérer 3 produits aléatoires', ()=>{
        cy.request({
            method:'GET',
            url: `${apiURL}/products/random`,
            headers: {Authorization: `Bearer ${token}`}
        }).then((response)=>{
            expect(response.status).to.eq(200);
            const products= response.body;
            expect(products).to.be.an('array').and.have.length(3);
            products.forEach((product)=>{
                expect(product).to.have.all.key(
                    'id',
                    'name',
                    'availableStock',
                    'skin',
                    'aromas',
                    'ingredients',
                    'description',
                    'price',
                    'picture',
                    'varieties'
                );
            });
        });
    });
});