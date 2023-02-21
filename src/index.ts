import WebSocket from 'ws';
import HttpsProxyAgent from 'https-proxy-agent';
import fs from 'fs';
import * as zksync from 'zksync';
import { ethers } from 'ethers';

const secret = require('../.secret.json');

// socks5://127.0.0.1:7890
// http://127.0.0.1:7890
const proxy = HttpsProxyAgent('socks5://127.0.0.1:7890');

async function zks() {
  const ethProvider = new ethers.providers.JsonRpcProvider(secret.rpcUrl);
  const ethWallet = new ethers.Wallet(secret.privateKey, ethProvider);
  // const ethWallet = ethers.Wallet.fromMnemonic(secret.phrase, `m/44'/60'/0'/0/${0}`).connect(ethProvider);
  console.log(ethWallet.address);
  const zksProvider = await zksync.getDefaultProvider('mainnet');
  const zksWallet = await zksync.Wallet.fromEthSigner(ethWallet, zksProvider);
  // const balance = await zksWallet.getBalance('ZZ');
  // console.log(ethers.utils.formatEther(balance));
  // const info = await zksWallet.getAccountState();
  // console.log(info);

  const state = await zksWallet.getAccountState();
  console.log(state.committed.balances);
  return;
  const order = await zksWallet.signOrder({
    tokenSell: 'ZZ',
    tokenBuy: 'USDC',
    ratio: zksync.utils.tokenRatio({ ZZ: '1', USDC: '3.5' }),
    amount: zksProvider.tokenSet.parseToken('ZZ', '1'),
  });
  console.log(order);
}

async function main() {
  const ethProvider = new ethers.providers.JsonRpcProvider(secret.rpcUrl);
  const ethWallet = new ethers.Wallet(secret.privateKey, ethProvider);
  const zksProvider = await zksync.getDefaultProvider('mainnet');
  const zksWallet = await zksync.Wallet.fromEthSigner(ethWallet, zksProvider);
  const accountId = (await zksWallet.getAccountId())?.toString() || '';
  console.log('账户Id', accountId);
  const order = await zksWallet.signOrder({
    tokenSell: 'ZZ',
    tokenBuy: 'USDC',
    ratio: zksync.utils.tokenRatio({ ZZ: '1', USDC: '3.5' }),
    amount: zksProvider.tokenSet.parseToken('ZZ', '1'),
  });
  const params = {
    op: 'submitorder3',
    args: [
      1,
      'ZZ-USDC',
      order,
    ],
  };
  console.log(params);
  const ws = new WebSocket('wss://zigzag-exchange.herokuapp.com', { agent: proxy });
  ws.on('error', console.error);
  ws.on('open', () => {
    console.log('open');
    ws.send(JSON.stringify({
      op: 'login',
      args: [
        1,
        accountId,
      ],
    }), (err) => {
      console.log(err);
      ws.send(JSON.stringify(params), (err) => console.log);
    });
  });
  ws.on('message', (json) => {
    try {
      const data = JSON.stringify(JSON.parse(json.toString()), null, 2) + ',\n';
      fs.appendFileSync('data.json', data, 'utf-8');
    } catch (e) {
      console.log(e);
    }
  });
}

main();
