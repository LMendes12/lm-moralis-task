/// <reference types="cypress" />


//TODO: Rename test names
describe('API Testing', () => {

  const nodeURL = Cypress.env("node_1")
  const chain = Cypress.env("chain")
  const apiKey = Cypress.env("apiKey")

  it('runs the api blockNumber', () => {

    const getBlockAPI = `${nodeURL}`

    cy.request({
      method: 'POST',
      url: `https://site1.moralis-nodes.com/${chain}/${apiKey}`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_blockNumber",
        params: []
      }
    }).then((response: Cypress.Response<any>) => {
      cy.log('Status: ' + response.status)
      cy.log('Response: ' + JSON.stringify(response))
      cy.log('BlockNumber is: ' + response.body.result)
      
    })






  })
})