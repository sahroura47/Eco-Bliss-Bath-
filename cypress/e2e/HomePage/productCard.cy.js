class productCard{
constructor(rootSelector){
        this.root=rootSelector;
    }
    getImage(){
        return cy.get(this.root).find('[data-cy=product-home-img]');
    }
    getName(){
        return cy.get(this.root).find('[data-cy=product-home-name]');
    }
    getIngredients(){
        return cy.get(this.root).find('[data-cy=product-home-ingredients]');
    }
    getPrice(){
        return cy.get(this.root).find('[data-cy=product-home-price]');
    }
    goToProductDetail(){
        return cy.get(this.root).find('[data-cy=product-home-link]').click();
    }
}
describe('vérifie la visibilité des cartes produits', ()=>{
    beforeEach(()=>{
        cy.visit('http://localhost:4200/#/');
    });
    it('chaque carte produit est visible correctement', ()=>{
        cy.get('[data-cy=product-home]').then(($cards) =>{
            const count= $cards.length;
            for( let i=0; i<count; i++) {
                cy.get('[data-cy=product-home]').eq(i).then(($card)=>{
                    const card= new productCard($card);
                    card.getImage().should('be.visible');
                    card.getName().should('be.visible');
                    card.getIngredients().should('be.visible');
                    card.getPrice().should('be.visible');
                });
        }
    });
});
});
    