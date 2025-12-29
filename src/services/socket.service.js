import io from 'socket.io-client';

class SocketService {
  socket = null;

  connect(token) {
    if (this.socket?.connected) return;

    // Production Connection
    this.socket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      auth: { token } // standardized auth handshake
    });

    this.socket.on('connect', () => {
      console.log("🔌 Socket Connected");
      // Explicitly emit authenticate event as required by backend events.py
      this.socket.emit('authenticate', { token });
    });

    this.socket.on('authenticated', (data) => {
      console.log("✅ Socket Authenticated:", data);
    });

    this.socket.on('authentication_error', (err) => {
      console.error("❌ Socket Auth Failed:", err);
    });

    this.socket.on('disconnect', () => {
      console.log("🔴 Socket Disconnected");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
