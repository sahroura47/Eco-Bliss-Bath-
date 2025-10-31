describe('test api login', () => {
    const apiURL = "http://localhost:8081"
    beforeEach(() => {
        cy.fixture('loginData.json').as('loginData');
    });
    it('connexion d`un utilisateur valide', function () {
        const user = this.loginData.validData;
        cy.request('POST', `${apiURL}/login`, {
            username: user.username,
            password: user.password
        }).then((response) => {
            expect(response.status).to.be.eq(200);
            expect(response.body).to.have.property('token')
        });
    });
    it('connexion échouée', function () {
        const user = this.loginData.wrongData;
        cy.request({
            method: 'POST',
            url: `${apiURL}/login`,
            body: { username: user.username, password: user.password },
            failOnStatusCode: false
        }).then((response)=>{
            expect(response.status).to.be.eq(401);
            expect(response.body).to.have.property('code', 401);
            expect(response.body).to.have.property('message', 'Invalid credentials.');
        })
    })
});