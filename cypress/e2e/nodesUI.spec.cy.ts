/// <reference types="cypress" />

import GlobalCommands from "../support/GlobalCommands"

//Load variables to be used
const url = Cypress.env("moralisAdmin")
const username = Cypress.env("username")
const password = Cypress.env("password")

describe('Positive UI tests to the Nodes page', () => {
    before('Login to Moralis Admin', () => {
        GlobalCommands.goTo(url)

        cy.get('#cookiescript_accept').click()

        cy.get('[id="admin-login-email"]').focus().type(username)
        cy.get('[id="admin-login-password"]').focus().type(password)
        cy.get('[data-testid="test-button"]').click()

        //Validate the Login was successful
        cy.get('[data-testid="test-typography"]').contains('Welcome')
    })
    it('Create a new Node', () => {

        cy.fixture('nodesPage.json').then((data) => {

            //Validate content on the page

            cy.get(data.elements.nodesLefthandMenuCta).contains('Nodes').click()
            cy.get(data.elements.typography).contains(data.content.title)
            cy.get(data.elements.typography).contains(data.content['sub-title'])
            cy.get(data.elements.accordionProtocolName).contains(data.content.eth_protocolName).click()
            cy.get(data.elements.eth_accordionCta)
                .find(data.elements.accordionChevron).click()
            cy.get(data.elements.siteInput).contains(data.content.eth_site1)
            cy.get(data.elements.siteInput).contains(data.content.eth_site2)

        })

    })
})