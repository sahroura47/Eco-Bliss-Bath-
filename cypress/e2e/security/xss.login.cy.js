describe('test de sécurité: faille xss', ()=>{
    const apiURL="http://localhost:8081"
    beforeEach(()=>{
        cy.visit('/login');
    });
    it('protection contre les attaques xss dans le champs username', ()=>{
        const xssPayload= `<img src=x onerror=alert("xss)>`;
        cy.intercept('POST', `${apiURL}/login`).as('loginRequest');

        cy.on('window:alert', ()=>{
            throw new Error('XSS exécuté!');
        });
        
        cy.get('[data-cy=login-input-username]').type(xssPayload);
        cy.get('[data-cy=login-input-password]').type('dummyPassword');
        cy.get('[data-cy=login-submit]').click();

    
        cy.get('body').then(($body)=>{
            expect($body.html()).to.not.contain('<img src=x');
            expect($body.html()).to.not.contain('onerror');
            expect($body.html()).to.not.contain('alert("xss")');
        });

        cy.get('[data-cy=login-errors]').should('be.visible');
    });
});