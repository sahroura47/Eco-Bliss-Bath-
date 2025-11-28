describe('tests d`API de création de compte', () => {
    const apiURL = "http://localhost:8081";
    it('création de compte avec des scénarios valides ( cas succès)', () => {
        cy.fixture('registerPageData.json').then((scenarios) => {

            const validScenarios = scenarios.filter(s => !s.expectedError);
            validScenarios.forEach((scenario) => {
                const timeStamp = Date.now();
                const requestBody = {
                    email: `user${timeStamp}@test.com`,
                    firstname: `${scenario.data.firstname.trim()}${timeStamp}`,
                    lastname: `${scenario.data.lastname.trim()}${timeStamp}`,
                    plainPassword: {
                        first: scenario.data.password,
                        second: scenario.data.password
                    }
                };
                cy.request({
                    method: "POST",
                    url: `${apiURL}/register`,
                    body: requestBody,
                    failOnStatusCode: false
                }).then((response) => {

                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property('id').and.to.be.a('number');
                    expect(response.body).have.property('email', requestBody.email);
                    expect(response.body).to.have.property('firstname', requestBody.firstname);
                    expect(response.body).to.have.property('lastname', requestBody.lastname);
                    expect(response.body).to.have.property('username').and.to.be.a('string');
                    expect(response.body).to.have.property('roles').and.to.be.an('array');
                });
            });
        });
    });
    it('création de compte avec des scénarios invalides ( cas échec)', () => {
        cy.fixture('registerPageData.json').then((scenarios) => {
            const invalidScenarios = scenarios.filter(s => s.expectedError);

            invalidScenarios.forEach((scenario) => {
                const requestBody = {
                    email: scenario.data.email,
                    firstname: scenario.data.firstname?.trim() || "",
                    lastname: scenario.data.lastname?.trim() || "",
                    plainPassword: {
                        first: scenario.data.password || "",
                        second: scenario.data.passwordConfirm 
                    }
                }
                cy.request({
                    method: "POST",
                    url: `${apiURL}/register`,
                    body: requestBody,
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(400);
                   if (!requestBody.email) {
                        expect(response.body).to.have.property('email');
                        expect(response.body.email).to.be.an('array').and.to.have.length.greaterThan(0);
                    }
                    if (!requestBody.plainPassword.first || requestBody.plainPassword.first !== requestBody.plainPassword.second) {
                        expect(response.body).to.have.property('plainPassword');
                        expect(response.body.plainPassword.first).to.be.an('array').and.to.have.length.greaterThan(0);
                    }
                });
            })

        });
    })
});