import io from 'socket.io-client';

class SocketService {
  socket = null;
  isConnecting = false;

  connect(token) {
    // Prevent multiple connection attempts
    if (this.socket?.connected || this.isConnecting) {
      console.log("Socket already connected or connecting");
      return;
    }

    this.isConnecting = true;
    console.log("🔌 Attempting socket connection...");

    // Production Connection with credentials for proper authentication
    this.socket = io('https://haki-yetu-backend.onrender.com', {
      withCredentials: true,  // Required for CORS with credentials
      transports: ['websocket', 'polling'],  // Try websocket first, fallback to polling
      autoConnect: true,
      reconnection: false, // Disable automatic reconnection to prevent loops
      auth: { token } // standardized auth handshake
    });

    this.socket.on('connect', () => {
      console.log("🔌 Socket Connected successfully");
      this.isConnecting = false;
      // Explicitly emit authenticate event as required by backend events.py
      this.socket.emit('authenticate', { token });
    });

    this.socket.on('authenticated', (data) => {
      console.log("Socket Authenticated:", data);
    });

    this.socket.on('authentication_error', (err) => {
      console.error(" Socket Auth Failed:", err);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error("Socket Connection Failed:", error.message);
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log("Socket Disconnected:", reason);
      this.isConnecting = false;
    });

    // Set a timeout for connection attempts
    setTimeout(() => {
      if (!this.socket?.connected && this.isConnecting) {
        console.log("⏰ Socket connection timeout");
        this.isConnecting = false;
        this.disconnect();
      }
    }, 5000);
  }

  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
