import io from 'socket.io-client';

// Connect to your Flask Backend URL (Port 5000)
const SOCKET_URL = 'http://127.0.0.1:5000';

class SocketService {
  socket = null;

  connect(token) {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      auth: { token }, // We send the JWT to prove who we are
      transports: ['websocket'], // Force modern connection
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket Server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('receive_message', (msg) => {
        callback(msg);
      });
    }
  }
}

export default new SocketService();
