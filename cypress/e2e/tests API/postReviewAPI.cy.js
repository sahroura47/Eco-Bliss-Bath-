describe('test d`ajout de review API', () => {
    const apiURL = "http://localhost:8081";
    let token;
    let loggedUser;

    beforeEach(() => {
        cy.fixture('loginData.json').then((data) => {
            const user = data.validData;
            loggedUser = user;
            cy.request('POST', `${apiURL}/login`, {
                username: user.username,
                password: user.password
            }).then((response) => {
                expect(response.status).to.be.eq(200);
                token = response.body.token;
            });
        });
    });

    it('poster un avis ( cas succès)', () => {
        cy.fixture('reviewPageData.json').then((reviewData) => {
            reviewData.validData.forEach((scenario) => {
                cy.request({
                    method: 'POST',
                    url: `${apiURL}/reviews`,
                    headers: { Authorization: `Bearer ${token}` },
                    body: scenario.filled,
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    const review = response.body;
                    expect(review).to.have.property('title', scenario.filled.title.trim());
                    expect(review).to.have.property('comment', scenario.filled.comment);
                    expect(review).to.have.property('rating', Number(scenario.filled.rating));
                    expect(review).to.have.property('author');
                    expect(review.author.username).to.eq(loggedUser.username);
                });
            });
        });
    });
    it('poster un avis (cas échec)', () => {
        
        const invalidReview = {
            title: "",           
            comment: "",
            rating: 1           
        };

        cy.request({
            method: 'POST',
            url: `${apiURL}/reviews`,
            headers: { Authorization: `Bearer ${token}` },
            body: invalidReview,
            failOnStatusCode: false 
        }).then((response) => {
            expect(response.status).to.eq(400);

            if (typeof response.body === 'object') {
                expect(response.body).to.have.property('error');
            }
        });
    });
});