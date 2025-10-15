describe('test de connexion', ()=>{
    beforeEach( function(){
        cy.fixture('loginData.json').as('loginData');
        cy.visit('/login');
    });
it('le formulaire login est affiché sur la page', ()=>{
  cy.get('[data-cy=login-form]').should('be.visible');
  cy.get('[data-cy=login-input-username]').should('exist');
  cy.get('[data-cy=login-input-password]').should('exist');
  cy.get('[data-cy=login-submit]').should('exist');
});
it('ne se connecte pas si les données sont vides', ()=>{
    cy.get('[data-cy=login-submit]').click();
    cy.get('[data-cy=login-errors]').should('be.visible').and('not.be.empty');
    cy.get('[data-cy=login-input-username]').should('have.class', 'ng-invalid' );
    cy.get('[data-cy=login-input-password]').should('have.class', 'ng-invalid');
});
it('se connecte si les données sont valides', function(){
    cy.fixture('loginData.json').then((data)=>{
        const validUser=data.validData;
        // on intercepte la requête POST vers /login 
        cy.intercept('POST','http://localhost:8081/login').as('loginRequest');
        // on remplie le formulaire 
        cy.get('[data-cy=login-input-username]').type(validUser.username);
        cy.get('[data-cy=login-input-password]').type(validUser.password);
        cy.get('[data-cy=login-submit]').click();
        // on attend et vérifie la requête et la réponse de l'api
        cy.wait('@loginRequest').then(({request,response}) =>{
            expect(request.body.username).to.eq(this.loginData.validData.username);
            expect(request.body.password).to.eq(this.loginData.validData.password);
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.have.property('token');
            //on vérifie le token dans le localStorage
            cy.window().its('localStorage.user').should('eq', response.body.token);
        });
       
        // on vérifie la redirection
        cy.url().should('not.include', '/login');
        cy.get('[data-cy=login-form]').should('not.exist');
    });    
});
it('ne se connecte pas si les données sont erronées et un message erreur est affiché',()=>{
    cy.fixture('loginData.json').then((data)=>{
        const invalidUser=data.wrongData;
        cy.intercept('POST', 'http://localhost:8081/login').as('loginRequest');
        cy.get('[data-cy=login-input-username]').type(invalidUser.username);
        cy.get('[data-cy=login-input-password]').type(invalidUser.password);
        cy.get('[data-cy=login-submit]').click();
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
        cy.get('[data-cy=login-errors]').should('be.visible').and('not.be.empty');
    });
});
});