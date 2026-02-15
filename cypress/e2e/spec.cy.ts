import { cy, describe, it } from 'local-cypress'

describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Les tables de multiplication')
  })

  it('can view and change app mode', () => {
    cy.visit('/')

    cy.get('#select-action').should('be.visible').get('option:selected').should('contain.value', 'Afficher')
    cy.get('article > table').should('be.visible').get('th').should('contain.text', 'Opération')
    cy.get('[data-e2e="btn-next-question"]').should('not.exist')

    cy.get('#select-action').select('Réviser')
    cy.get('article > table').should('not.exist')
    cy.get('[data-e2e="btn-next-question"]').should('be.visible')
  })

  it('can change number to study', () => {
    cy.visit('/')

    cy.get('#select-nombre').should('be.visible').select('3')
    cy.get('article > table').should('be.visible').get('th').should('contain.text', 'Opération')
    cy.get('tbody > :nth-child(1) > :nth-child(1)').should('contain.text', '1 x 3')
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('contain.text', '3')
    cy.get('tbody > :nth-child(4) > :nth-child(1)').should('contain.text', '4 x 3')
    cy.get('tbody > :nth-child(4) > :nth-child(2)').should('contain.text', '12')
    cy.get('tbody > :nth-child(10) > :nth-child(1)').should('contain.text', '10 x 3')
    cy.get('tbody > :nth-child(10) > :nth-child(2)').should('contain.text', '30')

    cy.get('#select-nombre').should('be.visible').select('10')
    cy.get('article > table').should('be.visible').get('th').should('contain.text', 'Opération')
    cy.get('tbody > :nth-child(1) > :nth-child(1)').should('contain.text', '1 x 10')
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('contain.text', '10')
    cy.get('tbody > :nth-child(4) > :nth-child(1)').should('contain.text', '4 x 10')
    cy.get('tbody > :nth-child(4) > :nth-child(2)').should('contain.text', '40')
    cy.get('tbody > :nth-child(10) > :nth-child(1)').should('contain.text', '10 x 10')
    cy.get('tbody > :nth-child(10) > :nth-child(2)').should('contain.text', '100')
  })

  it('can answer questions', () => {
    cy.visit('/')

    cy.get('#select-action').select('Réviser')
    cy.get('article > table').should('not.exist')

    cy.get('[data-e2e="btn-next-question"]').should('be.visible').click()
    cy.get('[data-e2e="good-answer"').should('not.exist');
    cy.get('[data-e2e="bad-answer"').should('not.exist');
    cy.get('.question').should('be.visible').invoke('text').should('match', /Combien font \d+ fois \d+ ?/).then(content => {
      // expect(content).matches("Combien font \d+ fois \d+ ?");
      const [, a, b] = /Combien font (\d+) fois (\d+) ?/.exec(content)
      const result = (+a)*(+b); // side-effect
      cy.get('#reponse').should('be.visible').type(''+result);
      cy.get('[name="submit"]').click();
      cy.get('[data-e2e="good-answer"]').should('be.visible');
      cy.get('[data-e2e="bad-answer"]').should('not.exist');
    })

    cy.get('[data-e2e="btn-next-question"]').should('be.visible').click()
    cy.get('[data-e2e="good-answer"]').should('not.exist');
    cy.get('[data-e2e="bad-answer"]').should('not.exist');
    cy.get('.question').should('be.visible').invoke('text').should('match', /Combien font \d+ fois \d+ ?/).then(content => {
      const result = 438427;
      cy.get('#reponse').should('be.visible').type(''+result);
      cy.get('[name="submit"]').click();
      cy.get('[data-e2e="good-answer"]').should('not.exist');
      cy.get('[data-e2e="bad-answer"]').should('be.visible');
    })

  })
})
