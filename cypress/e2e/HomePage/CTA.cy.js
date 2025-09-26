describe('CTA produits sur la page d`accueil', ()=>{
beforeEach(()=>{
    cy.visit('/');
});
it('chaque bouton "consulter" redirige vers la page produit correcte', ()=>{
    cy.get('[data-cy=product-home-link]').then(($buttons) =>{
        const count=$buttons.length;
        for (let i=0 ; i<count; i++) {
        cy.get('[data-cy=product-home-link]').eq(i)
        .invoke('attr', 'ng-reflect-router-link').then((link)=>{
            cy.get('[data-cy=product-home-link]').eq(i).click();
            cy.url().should('include', "/", link);
            cy.go('back');
        });
        }
    });
});
})
