import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';

// Make the time and users flutuate during the test execution
export const options = {
    stages: [
      { duration: '5s', target: 30 },
      { duration: '30s', target: 10 },
      { duration: '10s', target: 5 },
    ],
  };

export default function () {

    const apiAddress = config.apiAddress;
    const walletAddress = config.walletAddress;
    const web3ApiKey = config.web3ApiKey;
    const walletUrl = `${apiAddress}/${walletAddress}/nft`;
    const collectionUrl = `${apiAddress}/${walletAddress}/nft/collections`;

    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': web3ApiKey,
    };

    let getWallet = http.get(walletUrl, { headers: headers });
    // Check if the response status is 200
    check(getWallet, {
        'is status 200': (r) => r.status === 200,
    });

    let getCollectionWallet = http.get(collectionUrl, { headers: headers })
    check(getCollectionWallet, {
        'is status 200': (r) => r.status === 200,
    });

    sleep(1); // Sleep for 1 second between iterations
}
