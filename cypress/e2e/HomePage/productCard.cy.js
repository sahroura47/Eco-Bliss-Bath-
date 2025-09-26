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
module.exports={ productCard};