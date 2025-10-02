describe('validation du formulaire', () => {
    beforeEach(() => {
        cy.fixture('loginData.json').then((user) => {
            // on se connecte //
            cy.request('POST', 'http://localhost:8081/login', {
                username: user.username,
                password: user.password
            }).then((res) => {
                // on stocke le token pour simuler un utilisateur connecté //
                localStorage.setItem('user', res.body.token);
                cy.visit('/reviews');
                cy.get('[data-cy=review-form]').should('be.visible');

            });
        });
        cy.fixture('reviewPageData.json').as('reviewData');
        cy.get('@reviewData').then((reviewData) => {
            cy.contains(reviewData.loginPrompt).should('not.exist');
        });
    });
    it('ne doit pas valider si tous les champs sont vides', () => {
        cy.get('[data-cy=review-submit]').click();
        // vérifier que les champs sont invalides //
        cy.get('[data-cy=review-input-title]').should('have.class', 'ng-invalid');
        cy.get('[data-cy=review-input-comment]').should('have.class', 'ng-invalid');
        cy.get('[data-cy=review-input-rating]').should('have.class', 'ng-invalid');
    });
    it('ne doit pas valider si un seul champs est rempli', () => {
        // boucle sur les scénarios du reviewData json // 
        cy.get('@reviewData').then((reviewData) => {
            reviewData.formScenarios.forEach((scenario, index) => {
                if (scenario.filled.title) cy.get('[data-cy=review-input-title]').clear().type(scenario.filled.title);
                if (scenario.filled.comment) cy.get('[data-cy=review-input-comment]').clear().type(scenario.filled.comment);
                if (scenario.filled.rating) {
                    const rating = Number(scenario.filled.rating);
                    for (let i = 1; i <= rating; i++) {
                        cy.get('[data-cy=review-input-rating-images] img').eq(i - 1).click();
                    }
                }
                cy.get('[data-cy=review-submit]').click();
                scenario.empty.forEach((field) => {
                    cy.get(`[data-cy=review-input-${field}]`).should('have.class', 'ng-invalid');
                });
                Object.keys(scenario.filled).forEach((field) => {
                    cy.get(`[data-cy=review-input-${field}]`).should('have.class', 'ng-valid');
                });
                cy.get('[data-cy=review-input-title]').clear();
                cy.get('[data-cy=review-input-comment]').clear();
            });
        });
    });
    it('se connecte si les champs sont valides', () => {
        cy.get('@reviewData').then((reviewData) => {
            reviewData.validData.forEach((scenario) => {
                if (scenario.filled.title) {
                    cy.get('[data-cy=review-input-title]')
                        .clear()
                        .type(scenario.filled.title);
                }
                if (scenario.filled.comment) {
                    cy.get('[data-cy=review-input-comment]')
                        .clear()
                        .type(scenario.filled.comment);
                }
                if (scenario.filled.rating) {
                    const rating = Number(scenario.filled.rating);
                    for (let i = 1; i <= rating; i++) {
                        cy.get('[data-cy=review-input-rating-images] img').eq(i - 1).click();
                    }
                }
                cy.get('[data-cy=review-submit]').click();
                // on vérifie si les champs sont valides // 
                Object.keys(scenario.filled).forEach((field) => {
                    cy.get(`[data-cy=review-input-${field}]`).should('have.class', 'ng-valid');
                });
                // vérifier si les champs sont vidés après ajout de review //
                cy.get('[data-cy=review-input-title]').should('have.value', '');
                cy.get('[data-cy=review-input-comment]').should('have.value', '');
                cy.get('[data-cy=review-input-rating-images] img.selected').should('not.exist');

                cy.get('[data-cy=review-title]')
                    .contains('[data-cy=review-title]', scenario.filled.title)
                    .parents('[data-cy=review-detail]')
                    .within(() => {
                        cy.get('[data-cy=review-comment]').should('contain', scenario.filled.comment);
                        cy.get('[data-cy=review-note] img.selected').should('be.visible');
                    });
            });
        });

    });
    it('les champs sont valides avec long texte', () => {
        cy.get("@reviewData").then((reviewData) => {
            const scenario = reviewData.validData[1];
            // remplir le formulaire //
            cy.get('[data-cy=review-input-title]')
                .clear()
                .type(scenario.filled.title, { delay: 1 });
            // remplir par un long commentaire //
            cy.get('[data-cy=review-input-comment]')
                .clear()
                .type(scenario.filled.comment, { delay: 1 });
            //remplir la partie rating //
            const rating = Number(scenario.filled.rating);
            for (let i = 1; i <= rating; i++) {
                cy.get('[data-cy=review-input-rating-images] img').eq(i - 1).click();
            }
            cy.get('[data-cy=review-submit]').click();
            // on vérifie si le nouvel avis est ajouté // 
            cy.get('[data-cy=review-detail]').first().within(() => {
                cy.get('[data-cy=review-title]').should('contain', scenario.filled.title);
                cy.get('[data-cy=review-comment]').should('contain', scenario.filled.comment);
                cy.get('[data-cy=review-note] img.selected').should('be.visible');
            });
            // on vérifie visuellement que le layout n'est pas cassé  test UI// 
            cy.get('[data-cy=review-comment]').first().then(($el) => {
                const el = $el[0];
                expect(el.scrollWidth).to.be.lte(el.clientWidth); // largeur ok
                expect(el.scrollHeight).to.be.lte(el.clientHeight); // hauteur ok
            });
        });
    });
});
