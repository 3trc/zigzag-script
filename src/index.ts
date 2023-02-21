import WebSocket from 'ws';
import HttpsProxyAgent from 'https-proxy-agent';
import fs from 'fs';
import * as zksync from 'zksync';
import { ethers } from 'ethers';

// socks5://127.0.0.1:7890
// http://127.0.0.1:7890
const proxy = HttpsProxyAgent('socks5://127.0.0.1:7890');

async function main() {
  console.log('你好，世界');
  const provider = await zksync.getDefaultProvider('mainnet');
  const tokens = await provider.getTokens();
  console.log(tokens);
}

// async function main() {
//   console.log('你好，世界');
//   const ws = new WebSocket('wss://zigzag-exchange.herokuapp.com', {
//     agent: proxy,
//   });
//   ws.on('error', console.error);
//   ws.on('open', function open() {
//     console.log('open');
//     ws.send({ "op": "login", "args": [1002, "27334"] }.toString(), (err) => {
//       console.log(err);
//     });
//   });
//   ws.on('message', (json) => {
//     try {
//       // console.log(json.toString());
//       const data = JSON.stringify(JSON.parse(json.toString()), null, 2) + ',\n';
//       fs.appendFileSync('data.json', data, 'utf-8');
//     } catch (e) {
//       console.log(e);
//     }
//   });
// }

main();
