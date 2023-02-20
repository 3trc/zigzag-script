import WebSocket from 'ws';
import HttpsProxyAgent from 'https-proxy-agent';
import fs from 'fs';

// socks5://127.0.0.1:7890
// http://127.0.0.1:7890
const proxy = HttpsProxyAgent('socks5://127.0.0.1:7890');

async function main() {
  console.log('你好，世界');
  const ws = new WebSocket('wss://zigzag-exchange.herokuapp.com', {
    agent: proxy,
  });
  ws.on('error', console.error);
  ws.on('open', function open() {
    console.log('open');
    // ws.send('something');
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
