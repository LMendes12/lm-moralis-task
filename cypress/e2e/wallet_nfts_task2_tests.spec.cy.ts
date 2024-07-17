/// <reference types="cypress" />

//Load variables
const apiAddress = Cypress.env("moralisWeb3API")
const walletAddress = Cypress.env("walletAddress") //using the wallet address available on the moralis docs
const web3ApiKey = Cypress.env("web3ApiKey")
let tokenAddress = ''

///////////////////////////////////////////////
//////////////GET NFTs BY WALLET//////////////
/////////////////////////////////////////////

describe('Positive scenarios for the get NFTs by wallet API', () => {
    it('Validate successful response from the api', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nft`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            },
            qs: {
                chain: 'eth',
                format: 'decimal',
                media_items: false
            }
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(200)
            cy.log('The request was successful and returned status code: ' + response.status)
            tokenAddress = response.body.result[0].token_address
            cy.log('Token address to be used in next request is: ' + tokenAddress)
        })
    })

    it('Validate only the selected token_addresses NFTs are in the response', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nft`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            },
            qs: {
                chain: 'eth',
                format: 'decimal',
                media_items: false,
                token_addresses: [
                    tokenAddress
                ]
            }
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(200)

            //Validating the response is an array with only one result and the token address matches the request
            expect(response.body).to.have.property('result').that.is.an('array')
            expect(response.body.result).to.have.length(1)
            expect(response.body.result[0].token_address).to.eq(tokenAddress)
        })
    })

})

describe('Negative scenarios for the get NFTs by wallet API', () => {
    it('Runs the api with invalid apiKey', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nft`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': 'wrongKey'
            },
            qs: {
                chain: 'eth',
                format: 'decimal',
                media_items: false
            },
            failOnStatusCode: false
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(401)
            cy.log('Request failed with the following error message: ' + response.body.message)            
        })

    })

    it('Runs the api with invalid endpoint', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nftt`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            },
            qs: {
                chain: 'eth',
                format: 'decimal',
                media_items: false
            },
            failOnStatusCode: false
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(404)
            cy.log('Request failed with the following error message: ' + response.body)            
        })
    })

    it('Runs the api with invalid query parameters', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nft`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            },
            qs: {
                chain: 'dw',
                format: 'decimal',
                media_items: false
            },
            failOnStatusCode: false
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(400)
            cy.log('Request failed with the following error message: ' + response.body.message)            
        })

    })
})


//////////////////////////////////////////////////////////
//////////////GET NFT COLLECTIONS BY WALLET//////////////
////////////////////////////////////////////////////////

describe('Positive scenarios for the get NFT collections by wallet', () => {
    it('Validate get NFT collections by wallet successful response from the api', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nft/collections`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            },
            qs: {
                'total_count': false
            }
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(200)
            cy.log('The request was successful and returned status code: ' + response.status)

        })
    })

    it('Validate count is not displayed when token_counts is set to false', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nft/collections`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            },
            qs: {
                'total_count': false
            }
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(200)
            expect(response.body.result[0]).to.not.have.property('count')
        })
    })

    it('Validate count is displayed when token_counts is set to true', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nft/collections`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            },
            qs: {
                token_counts: true
            }
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(200)
            expect(response.body.result[0]).to.have.property('count')

        })
    })
})

describe('Negative scenarios for the get NFT collections by wallet', () => {
    it('Runs the api with invalid apiKey', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nft/collections`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': 'wrongKey'
            },
            failOnStatusCode: false
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(401)
            cy.log('Request failed with the following error message: ' + response.body.message)            
        })

    })

    it('Runs the api with invalid endpoint', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/${walletAddress}/nft/collections/wallet`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            },
            failOnStatusCode: false
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(404)
            cy.log('Request failed with the following error message: ' + response.body)            
        })
    })

    it('Runs the api with invalid wallet address', () => {
        cy.request({
            method: 'GET',
            url: `${apiAddress}/notExistentAddress/nft/collections`,
            headers: {
                'content-type': 'application/json',
                'x-api-key': web3ApiKey
            },
            failOnStatusCode: false
        }).then((response: Cypress.Response<any>) => {
            expect(response.status).eq(400)
            cy.log('Request failed with the following error message: ' + response.body.message)            
        })

    })
})

