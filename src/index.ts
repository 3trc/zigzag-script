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

function createWallet(index: number) {
  return ethers.Wallet.fromMnemonic(secret.mnemonic, `m/44'/60'/0'/0/${index}`);
}

async function main() {
  const provider = await zksync.getDefaultProvider('mainnet');
  const list = await Promise.all(
    Array(50).fill(0).map((_, index) => createWallet(index).address)
      .map((address) => getZZBalance(provider, address))
  );
  const amounts = list.map((amount) => Number(ethers.utils.formatUnits(amount, 18)));
  console.log(amounts);
  let sum = 0;
  amounts.forEach((amount) => sum += amount);
  console.log(sum);
}

main();
