/// <reference types="cypress" />

import GlobalCommands from "../support/GlobalCommands"

//Load variables to be used
const url = Cypress.env("moralisAdmin")
const username = Cypress.env("username")
const password = Cypress.env("password")

describe('Positive UI tests to the Nodes page', () => {

    before('Login to Moralis Admin', () => {

        cy.clearLocalStorage();
        GlobalCommands.goTo(url)

        cy.get('#cookiescript_accept').click()

        //TODO: parametrize elements
        cy.get('[id="admin-login-email"]').focus().type(username)
        cy.get('[id="admin-login-password"]').focus().type(password)
        cy.get('[data-testid="test-button"]').click()

        //Validate the Login was successful
        cy.get('[data-testid="test-typography"]').contains('Welcome').should('be.visible')
    })

    /*
    For the UI tests, the idea would be to parametrize both elements and content as displayed below, so if anything changes
    it would be easily fixed. The elements should use unique ids when possible, so I would also work with the developers to try and 
    improve that from what is available at the moment.
    The UI tests would create new nodes, open and close the accordions, delete accordions, validate the API key through the 
    key button is correct as well as negative scenarios like trying to add invalid data to the input fields.
    */
    it('Create a new Node', () => {

        cy.fixture('nodesPage.json').then((data) => {

            //Validate content on the page

            cy.get(data.elements.nodesLefthandMenuCta).contains('Nodes').click()
            cy.get(data.elements.typography).contains(data.content.title)
            cy.get(data.elements.typography).contains(data.content['sub-title'])
            cy.wait(500)
            cy.get(data.elements.accordionProtocolName).contains(data.content.eth_protocolName).click()
            cy.get(data.elements.siteInput1).contains(data.content.eth_site1)
            cy.get(data.elements.siteInput2).contains(data.content.eth_site2)

        })

    })
})