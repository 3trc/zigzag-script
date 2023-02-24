import * as zksync from 'zksync';
import { DingTalk } from 'litebot';

export
function message(text: string) {
  const secret = require('../.secret.json');
  new DingTalk(secret.notifier).SendMessage(text);
}

async function getZZBalance(provider: zksync.Provider, address: string) {
  const state = await provider.getState(address);
  return state?.committed?.balances?.ZZ || '';
}

const addressList = [
  '0xf2f7ad044dfbaa417249c8568788d7aa1e6f155b',
  '0x52d0a0775a819766cecd6edccc45a4a5bada7ed6',
  '0x10f431603f36d784710e581b5cf003290a861e00',

  '0x28dF8c4d5fc59cA685546e817772181Fb717E503',
  '0x0Fd2B60c6a83F91083c644C1f677797BfD63209A',
  '0x05484987F0d85dAd6F10a53B0Fd57AF880A0ff71',
  '0x7F3b3C3f7e69E91D95a32f0A054B8C1B3167865C',
  '0xC6d908fb8ad05D4c5664e1770878892BCe37Cb06',
];

async function main() {
  message('运行了');
  const data = { } as any;
  const provider = await zksync.getDefaultProvider('mainnet');
  let index = 0;
  setInterval(async () => {
    try {
      const current = index % addressList.length;
      const address = addressList[current];
      console.log(address, '...');
      const balance = await getZZBalance(provider, address);
      console.log('ZZ: ', balance);
      const oldBalance = data[address];
      if (balance !== oldBalance && oldBalance != null) {
        message(`变化 ${address} ${balance}`);
      }
      data[address] = balance;
      index++;
    } catch (e) {
      console.log(e);
    }
  }, 2000);
}

main();
