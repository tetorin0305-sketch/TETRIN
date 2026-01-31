
class NetworkManager {
    constructor() {
        this.socket = io();
        this.isHost = false; // Added to track host status
        this.initListeners();
    }

    initListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to server with ID:', this.socket.id);
            this.updateStatus('Connected to server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.updateStatus('Disconnected');
        });

        this.socket.on('lobbyUpdate', (data) => {
            console.log('Lobby Update:', data);
            this.currentRoomId = data.roomId;
            const myPlayer = data.players.find(p => p.id === this.socket.id);
            this.isHost = myPlayer && myPlayer.index === 1;

            // Dispatch event for game.js to catch
            const event = new CustomEvent('networkLobbyUpdate', { detail: data });
            window.dispatchEvent(event);
        });

        this.socket.on('roomFull', (roomId) => {
            alert(`Room ${roomId} is full!`);
            this.updateStatus('Room is full');
        });

        this.socket.on('gameStart', (data) => {
            console.log('Game Start!', data);
            const event = new CustomEvent('networkGameStart', { detail: data });
            window.dispatchEvent(event);
        });

        this.socket.on('gameEvent', (data) => {
            const event = new CustomEvent('networkGameEvent', { detail: data });
            window.dispatchEvent(event);
        });

        this.socket.on('lobbyReturn', (data) => {
            const event = new CustomEvent('networkLobbyReturn', { detail: data });
            window.dispatchEvent(event);
        });

        this.socket.on('opponentRematchRequested', () => {
            const event = new CustomEvent('networkOpponentRematch');
            window.dispatchEvent(event);
        });
    }

    joinRoom(roomId) {
        if (roomId) {
            this.socket.emit('joinRoom', roomId);
            this.updateStatus(`Joining ${roomId}...`);
        } else {
            alert('Please enter a Room ID');
        }
    }

    leaveRoom() {
        this.socket.emit('leaveRoom');
        this.currentRoomId = null;
        this.isHost = false;
        this.updateStatus('Left room');
    }

    toggleReady() {
        this.socket.emit('toggleReady');
    }

    updateSettings(settings) {
        this.socket.emit('updateSettings', settings);
    }

    sendGameEvent(type, payload) {
        if (this.currentRoomId) {
            this.socket.emit('gameEvent', {
                roomId: this.currentRoomId,
                type: type,
                payload: payload
            });
        }
    }

    requestStart() {
        if (this.currentRoomId && this.isHost) {
            this.socket.emit('requestStart');
        }
    }

    requestRestart() {
        if (this.currentRoomId) {
            this.socket.emit('requestRestart');
        }
    }

    backToLobby() {
        if (this.currentRoomId) {
            this.socket.emit('backToLobby');
        }
    }

    updateStatus(msg) {
        const el = document.getElementById('connection-status');
        if (el) el.textContent = msg;
    }
}

// Global instance
// Global instance
window.networkManager = new NetworkManager();
