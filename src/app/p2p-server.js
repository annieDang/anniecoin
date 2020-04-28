const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPE = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  reset_transactions: "RESET_TRANSACTIONS"
}

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for peer to peer connections on ${P2P_PORT}`)
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log(`${socket.port} is connected`);

    this.messageHandler(socket);
    this.sendChain(socket);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);

      socket.on('open', () => this.connectSocket(socket));
    });
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);

      if (data.sender) {
        console.log(`sender: ${data.sender}, type: ${data.type}`);
      }

      switch (data.type) {
        case MESSAGE_TYPE.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPE.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPE.reset_transactions:
          this.transactionPool.clear();
          break;
        // default: throw new Exception("there is no message type");
      }

    });
  }

  sendChain(socket) {
    console.log("send the chain");
    socket.send(JSON.stringify({
      type: MESSAGE_TYPE.chain,
      sender: P2P_PORT,
      chain: this.blockchain.chain
    }));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPE.transaction,
      sender: P2P_PORT,
      transaction
    }));
  }

  resetTransactions(socket) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPE.reset_transactions,
      sender: P2P_PORT
    }));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastResetTransactions() {
    console.log(this.sockets.length);
    this.sockets.forEach(socket => this.resetTransactions(socket));
  }
}

module.exports = P2pServer;