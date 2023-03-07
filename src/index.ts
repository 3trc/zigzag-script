import * as zksync from 'zksync';
import { DingTalk } from 'litebot';
import { ethers } from 'ethers';

const secret = require('../.secret.json');

export
function message(text: string) {
  const secret = require('../.secret.json');
  new DingTalk(secret.notifier).SendMessage(text);
}

async function getZZBalance(provider: zksync.Provider, address: string) {
  const state = await provider.getState(address);
  return state?.committed?.balances?.ZZ || '0';
}

async function getETHBalance(provider: zksync.Provider, address: string) {
  const state = await provider.getState(address);
  return state?.committed?.balances?.ETH || '0';
}

function createWallet(index: number) {
  return ethers.Wallet.fromMnemonic(secret.mnemonic, `m/44'/60'/0'/0/${index}`);
}

function myAccountName(index: number) {
  if (index < 1) return '主账户';
  else if (index < 3) return `搁置账户${index}`;
  return `子账户${index - 2}`;
}

async function main() {
  const provider = await zksync.getDefaultProvider('mainnet');
  const list = await Promise.all(
    Array(200).fill(0).map((_, index) => createWallet(index).address)
      .map((address) => getETHBalance(provider, address))
  );
  const amounts = list.map((amount) => Number(ethers.utils.formatUnits(amount, 18)));
  
  // let countZZ = 1;
  // amounts.forEach((amount, index) => {
  //   if (amount >= 0.1) {
  //     console.log(countZZ++, `${myAccountName(index)}: ${amount} ZZ`);
  //   }
  // });

  let countETH = 1;
  amounts.forEach((amount, index) => {
    if (amount >= 0.0002) {
      console.log(countETH++, `${myAccountName(index)}: ${amount} ETH`);
    }
  });
  
  // console.log(amounts);
  // let sum = 0;
  // amounts.forEach((amount) => sum += amount);
  // console.log(sum);
}

main();
