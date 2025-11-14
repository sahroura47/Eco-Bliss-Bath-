describe('test de sécurité faille xss review page', () => {
    beforeEach(() => {
        cy.fixture('loginData.json').then((user) => {

            cy.request('POST', 'http://localhost:8081/login', user.validData).then((res) => {

                localStorage.setItem('user', res.body.token);
                cy.visit('http://localhost:4200/#/reviews');
                cy.get('[data-cy=review-form]').should('be.visible');
            });
        });
    });

    it('test pour détecter la faille xss dans le champs titre', () => {
        const xssPayload = `<img src=x onerror=alert("xss")>`;

        cy.on('window:alert', () => {
            throw new Error('XSS exécuté!');
        });
        
        cy.get('[data-cy=review-input-title]').clear().type(xssPayload);
        cy.get('[data-cy=review-input-comment]').clear().type('commentaire sûr');
        cy.get('[data-cy=review-input-rating-images]').click();
        cy.get('[data-cy=review-submit]').click({force: true});


        cy.get('body').then(($body) => {
            const html = $body.html();
            expect(html).to.not.include('<img src=x');
            expect(html).to.not.include('onerror');
            expect(html).to.not.include('alert("xss")');
        });

    });
    it('détection de faille xss dans le champs commentaire', () => {
        const xssPayload = `<script>alert("xss")</script>`;
        cy.on('window:alert', () => {
            throw new Error('XSS exécuté!');
        });

        cy.get('[data-cy=review-input-title]').clear().type('titre sûr');
        cy.get('[data-cy=review-input-comment]').clear().type(xssPayload);
        cy.get('[data-cy=review-input-rating-images]').click({force: true});
        cy.get('[data-cy=review-submit]').click();

        cy.get('body').then(($body) => {
            const html = $body.html();
            expect(html).to.not.include(`<script>alert("xss")</script>`);
            expect(html).to.not.include('alert("xss")');
        });

    })

});