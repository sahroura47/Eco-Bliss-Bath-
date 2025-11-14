describe('test get reviews API', () => {
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
    it('on récupère les avis postés sur le site', ()=>{
        cy.request({
            method: 'GET',
            url: `${apiURL}/reviews`,
            headers: {Authorization: `Bearer ${token}`},
            failOnStatusCode: false
        }).then((response)=>{
            expect(response.status).to.eq(200);
            const reviews= response.body;
            expect(reviews).to.be.an('array').and.not.be.empty;

            const review= reviews[0];
            expect(review).to.have.all.keys(
                'id',
                'date',
                'title',
                'comment',
                'rating',
                'author'
            );
           expect(review.id).to.be.a('number');
           expect(review.title).to.be.a('string');
           expect(review.comment).to.be.a('string');
           expect(review.rating).to.be.a('number');
           expect(review.author).to.be.an('object');
        });
    });
});