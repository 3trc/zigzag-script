import WebSocket from 'ws';

async function main() {
  console.log('你好，世界');
  const ws = new WebSocket('wss://zigzag-exchange.herokuapp.com');
  ws.on('error', console.error);
  ws.on('open', function open() {
    console.log('open');
    // ws.send('something');
  });
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
}

main();
