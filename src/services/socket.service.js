import io from 'socket.io-client';

// Empty string = use current domain (proxy handles the routing)
const SOCKET_URL = '';

class SocketService {
  socket = null;

  connect(token) {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    this.socket.on('connect', () => console.log('✅ Socket Connected via Proxy'));
    this.socket.on('connect_error', (err) => console.error('❌ Socket Error:', err));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) this.socket.emit(event, data);
  }

  on(event, callback) {
    if (this.socket) this.socket.on(event, callback);
  }

  onMessageReceived(callback) {
    this.on('receive_message', callback);
  }
}

export default new SocketService();
