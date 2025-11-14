describe('récupérer les données de l`utilisateur connecté', () => {
    const apiURL = "http://localhost:8081";
    let token;
    let user;
    beforeEach(() => {
        cy.fixture('loginData.json').then((data) => {
            user = data.validData;
            cy.request('POST', `${apiURL}/login`, {
                username: user.username,
                password: user.password
            }).then((response) => {
                expect(response.status).to.be.eq(200);
                token = response.body.token;
            });
        });
    });
    it('récupérer les datas du user connecté', () => {
        cy.request({
            method: "GET",
            url: `${apiURL}/me`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response)=>{
            expect(response.status).to.eq(200);
            const body= response.body;
            expect(body).to.have.property('id').and.to.be.a('number');
            expect(body).to.have.property('email', user.username);
            expect(body).to.have.property('userIdentifier', user.username);
            expect(body).to.have.property('username', user.username);
            expect(body).to.have.property('roles').and.to.be.an('array');
            expect(body).to.have.property('password').and.to.be.a('string');
            expect(body).to.have.property('salt');
            if(body.salt !== null){
                expect(body.salt).to.be.a('number')
            }
            expect(body).to.have.property('firstname').and.to.be.a('string');
            expect(body).to.have.property('lastname').and.to.be.a('string');
        })
    })
})