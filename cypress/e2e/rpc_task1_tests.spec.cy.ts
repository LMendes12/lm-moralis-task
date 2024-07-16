/// <reference types="cypress" />

import GlobalCommands from "../support/GlobalCommands"

//Load the environment variables to be used through the tests
const nodeURL = Cypress.env("node_1")
const chain = Cypress.env("chain")
const apiKey = Cypress.env("apiKey")

describe('Positive scenarios for RPC API testing', () => {

  // Create variables to store results from the API requests
  let blockNumber = ''
  let hashNumber = ''

  it('Runs BlockNumber and stores the result', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/${apiKey}`,
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
      expect(response.status).eq(200)

      blockNumber = response.body.result

      cy.log('Block Number is: ' + blockNumber)
    })
  })
  it.skip('Runs BlockNumber to test rate limiting', () => {
    for (let i = 0; i < 100; i++) {
      cy.request({
        method: 'POST',
        url: `${nodeURL}/${chain}/${apiKey}`,
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
        expect(response.status).eq(200)

        blockNumber = response.body.result

        cy.log('Block Number is: ' + blockNumber)
      })
    }
  })

  //TODO: Understand why result is returning null
  it('Runs Get Block Number with blockNumber and stores the hash', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/${apiKey}`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByNumber",
        params: [
          blockNumber,
          true]
      }
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(200)
      expect(response.body.result.number).eq(blockNumber)

      hashNumber = response.body.result.hash
      cy.log('The hash is ' + hashNumber)
    })

  })
  it.skip('Runs Get Block Number to test rate limiting', () => {
    for (let i = 0; i < 100; i++) {
      cy.request({
        method: 'POST',
        url: `${nodeURL}/${chain}/${apiKey}`,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBlockByNumber",
          params: [
            blockNumber,
            true]
        }
      }).then((response: Cypress.Response<any>) => {
        expect(response.status).eq(200)
        expect(response.body.result.number).eq(blockNumber)

        hashNumber = response.body.result.hash
        cy.log('The hash is ' + hashNumber)
      })
    }

  })

  it('Runs Get Transaction by Hash with hashNumber and validates the result', () => {

    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/${apiKey}?-ltxqueue=trac`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByNumber",
        params: [
          "latest",
          true]
      }
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(200)

      hashNumber = response.body.result.hash
      cy.log('The hash is ' + hashNumber)

      cy.request({
        method: 'POST',
        url: `${nodeURL}/${chain}/${apiKey}`,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getTransactionByHash",
          params: [
            hashNumber]
        }
      }).then((response: Cypress.Response<any>) => {
        expect(response.status).eq(200)

        cy.log('The hash is ' + JSON.stringify(response.body))
      })
    })

  })
  it.skip('Runs Get Transaction by Hash to test rate limiting', () => {
    for (let i = 0; i < 100; i++) {
      cy.request({
        method: 'POST',
        url: `${nodeURL}/${chain}/${apiKey}`,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getTransactionByHash",
          params: [
            "0xd4b2e80202cc55517c328412a7792772e1bdd925ac1a2120aeafe84316206ad3",
            true]
        },
        failOnStatusCode: false
      }).then((response: Cypress.Response<any>) => {
        expect(response.status).eq(200)
      })
    }
  })
})

describe('Negative scenarios for RPC API testing', () => {

  /////////////////////////////////////////
  //////////////BLOCK NUMBER//////////////
  ///////////////////////////////////////

  it('Runs BlockNumber with invalid apiKey', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/wrongAPIkey`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_blockNumber",
        params: []
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(401)
      cy.log('Request failed with the following error message: ' + response.body.message)

    })
  })

  it('Runs BlockNumber with wrong API endpoint', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/${apiKey}/inexistent`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "u73iy3y7d3",
        id: 1,
        method: "eth_blockNumber",
        params: []
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(404)
      cy.log('Request failed with the following error message: ' + response.body.message)

    })
  })

  /*In the test below I was expecting the result to be 200 to follow the pattern shown on the tests below, 
  but to return an error message. However, it returns 200 OK and no error message.
  Even though the test fails is left here, this would lead to a bug being raised and expected to pass once
  the API returns the expected result (a comprehensive error message to the user)
*/
  it('Runs BlockNumber with missing required fields', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/${apiKey}`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        method: "eth_blockNumber",
        params: []
      },
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(400)
      cy.log(JSON.stringify(response))
    })
  })

  /////////////////////////////////////////
  ////////////BLOCK BY NUMBER ////////////
  ///////////////////////////////////////

  it('Runs Get Block by Number with wrong apiKey', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/EIDehduewhdiuew78`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByNumber",
        params: [
          "latest",
          true]
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(401)
      cy.log('Request failed with the following error message: ' + response.body.message)


    })

  })

  it('Runs Get Block by Number with wrong endpoint', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/${apiKey}/invalid`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByNumber",
        params: [
          "latest",
          true]
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(404)
      expect(response.body.name).eq("NotFoundException")
      cy.log('Request failed with the following error message: ' + response.body.message)


    })

  })

  /* With the test below, I expected it to error every single time, however through testing it here 
and with the Test Live option on the dashboard I saw that sometimes the request goes through
and returns a successful response, when that happens this test will fail because it doesn't find the 
error message. However this seems like a bug in the API, and it should always fail if the user sends 
invalid parameters. */
  it('Runs Get Block by Number with random blockNumber', () => {
    const randomNumber = GlobalCommands.getRandomFiveDigitNumber
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/${apiKey}`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByNumber",
        params: [
          randomNumber,
          true]
      }
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(200)
      expect(response.body.error.message).eq("Invalid params")
      cy.log('Request failed with the following error message: ' + response.body.error.message)


    })

  })

  /////////////////////////////////////////
  ///////TRANSACTION BY HASH NUMBER///////
  ///////////////////////////////////////

  it('Runs Get Transaction by Hash with wrong apiKey', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/EIDehduewhdiuew78`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getTransactionByHash",
        params: [
          "latest",
          true]
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(401)
      cy.log('Request failed with the following error message: ' + response.body.message)
    })

  })

  it('Runs Get Transaction by Hash with wrong endpoint', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/${apiKey}/invalid`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getTransactionByHash",
        params: [
          "latest",
          true]
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(404)
      expect(response.body.name).eq("NotFoundException")
      cy.log('Request failed with the following error message: ' + response.body.message)
    })

  })

  it('Runs Get Transaction by Hash with missing hashNumber', () => {
    cy.request({
      method: 'POST',
      url: `${nodeURL}/${chain}/${apiKey}`,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getTransactionByHash",
        params: [

          true]
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).eq(200)

      //Added this oneOf since when running multiple times in a row both error messages were being returned randomly
      expect(response.body.error.message).to.be.oneOf([
        "invalid argument 0: json: cannot unmarshal non-string into Go value of type common.Hash",
        "Invalid params"
      ])
      cy.log('Request failed with the following error message: ' + response.body.error.message)
    })

  })

})