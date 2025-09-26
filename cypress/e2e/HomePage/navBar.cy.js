describe('barre de navigation', () => {
    beforeEach(() => {
        cy.visit('/')
    });
    it('affiche les liens de navigations', () => {
        cy.get('nav.navigation').should('be.visible');
        cy.get('[data-cy=nav-link-home]').should('contain', 'Accueil');
        cy.get('[data-cy=nav-link-products]').should('contain', 'Produits');
        cy.get('[data-cy=nav-link-reviews]').should('contain', "Avis");
        cy.get('[data-cy=nav-link-login]').should('contain', 'Connexion');
        cy.get('[data-cy=nav-link-register]').should('contain', 'Inscription');
    });
    it('naviguer vers la page Produits', () => {
        cy.get('[data-cy=nav-link-products]').click();
        cy.url().should('include', '/products');
    });
    it('naviguer vers la page Avis', () => {
        cy.get('[data-cy=nav-link-reviews]').click();
        cy.url().should('include', '/reviews');
    });
    it('naviguer vers la page connexion', () => {
        cy.get('[data-cy=nav-link-login]').click();
        cy.url().should('include', '/login');
    });
    it('naviguer vers la page inscription', () => {
        cy.get('[data-cy=nav-link-register]').click();
        cy.url().should('include', '/register');
    });
    it('le logo est visible', ()=>{
        cy.get('[data-cy=nav-link-home-logo]').should('be.visible');
        cy.get('[data-cy=nav-link-home-logo] img').should('have.attr', 'alt', 'Logo EcoBlissBath');
    });
    it('le logo navigue vers la page d’accueil', ()=>{
        cy.get('[data-cy=nav-link-home-logo]').click();
        cy.url().should('include','/');
    })
});