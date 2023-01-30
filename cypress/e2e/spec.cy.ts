import { cy, describe, it } from 'local-cypress'

describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Les tables de multiplication')
  })
})
