// Fixes Issue 409 : when clicking on "Question Suivante !" button, focus should be on the reponse input, and its content should be empty.
import { cy, describe, it } from 'local-cypress'

describe('Issue 409 Fix : when clicking on "Question Suivante !" button, focus should be on the reponse input, and its content should be empty.', () => {

  it('should focus on and empty the reponse input when responding to multiple questions each time the button "Question Suivante !" is clicked', () => {
    cy.visit('/');

    cy.get('#select-action').select('Réviser');
    cy.get('article > table').should('not.exist');

    for (let i = 0; i < 3; i++) {
      cy.get('[data-e2e="btn-next-question"]').should('be.visible').click()
      cy.get('.question').should('be.visible').invoke('text').should('match', /Combien font \d+ fois \d+ ?/).then(content => {
        // expect(content).matches("Combien font \d+ fois \d+ ?");
        const [, a, b] = /Combien font (\d+) fois (\d+) ?/.exec(content)
        const result = (+a)*(+b); // side-effect
        cy.get('#reponse')
          .should('be.visible')
          .should('have.focus')
          .should('have.value', '');
        cy.get('#reponse')
          .type(''+result);
        cy.get('[data-e2e="btn-validate-answer"]').should('be.visible').click();
        cy.get('[data-e2e="good-answer"]').should('be.visible');
        cy.get('[data-e2e="bad-answer"]').should('not.exist');
      });
    }
  });
});
