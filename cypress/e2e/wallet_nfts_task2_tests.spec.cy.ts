/// <reference types="cypress" />

//Load variables
const apiAddress = Cypress.env("moralisWeb3API")
const address = Cypress.env("address")
const web3ApiKey = Cypress.env("web3ApiKey")


describe('Positive scenarios for the getWallet API', () => {
    it('Get Results', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${address}/nft`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            }
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(200)
            cy.log(JSON.stringify(response))
        })

    })

})