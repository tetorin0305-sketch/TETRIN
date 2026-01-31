const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://tetorin0305-sketch.github.io", "http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST"]
    }
});

// Serve static files from the current directory
app.use(express.static(__dirname));


const rooms = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
        let room = rooms.get(roomId);

        if (!room) {
            room = {
                players: [],
                gameStarted: false,
                settings: { winningSets: 1 }
            };
            rooms.set(roomId, room);
        }

        if (room.players.length >= 2) {
            socket.emit('roomFull', roomId);
            return;
        }

        // Add player to room state
        const player = {
            id: socket.id,
            index: room.players.length + 1,
            ready: false,
            name: `Player ${room.players.length + 1}`
        };

        room.players.push(player);
        socket.join(roomId);
        socket.roomId = roomId; // Track room on socket

        console.log(`User ${socket.id} joined room ${roomId}`);

        // Notify everyone in the room about the new state
        broadcastLobbyState(roomId);
    });

    socket.on('toggleReady', () => {
        const roomId = socket.roomId;
        const room = rooms.get(roomId);
        if (room) {
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                player.ready = !player.ready;
                broadcastLobbyState(roomId);
            }
        }
    });

    socket.on('updateSettings', (settings) => {
        const roomId = socket.roomId;
        const room = rooms.get(roomId);
        if (room && room.players[0].id === socket.id) {
            room.settings = { ...room.settings, ...settings };
            broadcastLobbyState(roomId);
        }
    });

    socket.on('requestStart', () => {
        const roomId = socket.roomId;
        const room = rooms.get(roomId);

        // Only host (players[0]) can start, and only if everyone is ready
        if (room && room.players[0].id === socket.id) {
            const allReady = room.players.every(p => p.ready || p.id === room.players[0].id);
            if (allReady && room.players.length === 2) {
                const seed = Date.now();
                const startTime = Date.now() + 3000;

                io.to(roomId).emit('gameStart', {
                    players: room.players.map(p => p.id),
                    seed: seed,
                    startTime: startTime,
                    settings: room.settings
                });
                room.gameStarted = true;
                console.log(`Game started in room ${roomId}`);
            }
        }
    });

    socket.on('leaveRoom', () => {
        handleLeaveRoom(socket);
    });

    // Relay game events (move, rotate, etc.) to opponent
    socket.on('gameEvent', (data) => {
        if (data.roomId) {
            socket.to(data.roomId).emit('gameEvent', data);
        }
    });

    socket.on('requestRestart', () => {
        const roomId = socket.roomId;
        const room = rooms.get(roomId);
        if (room && room.players.length === 2) {
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                player.rematchVote = true;

                // Notify the other player
                socket.to(roomId).emit('opponentRematchRequested');

                const allVote = room.players.every(p => p.rematchVote);
                if (allVote) {
                    // Both agreed, reset votes and start
                    room.players.forEach(p => p.rematchVote = false);
                    room.gameStarted = true;
                    const seed = Date.now();
                    const startTime = Date.now() + 5000; // Increased to 5s for better sync buffer
                    io.to(roomId).emit('gameStart', {
                        players: room.players.map(p => p.id),
                        seed: seed,
                        startTime: startTime,
                        settings: room.settings
                    });
                }
            }
        }
    });

    socket.on('backToLobby', () => {
        const roomId = socket.roomId;
        const room = rooms.get(roomId);
        if (room) {
            room.gameStarted = false;
            room.players.forEach(p => {
                p.ready = false;
                p.rematchVote = false;
            });
            io.to(roomId).emit('lobbyReturn', { initiatorId: socket.id });
            broadcastLobbyState(roomId);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        handleLeaveRoom(socket);
    });

    function broadcastLobbyState(roomId) {
        const room = rooms.get(roomId);
        if (room) {
            io.to(roomId).emit('lobbyUpdate', {
                roomId: roomId,
                players: room.players,
                settings: room.settings,
                gameStarted: room.gameStarted
            });
        }
    }

    function handleLeaveRoom(socket) {
        const roomId = socket.roomId;
        if (!roomId) return;

        let room = rooms.get(roomId);
        if (room) {
            const index = room.players.findIndex(p => p.id === socket.id);
            if (index !== -1) {
                room.players.splice(index, 1);
                socket.leave(roomId);
                socket.roomId = null;

                if (room.players.length === 0) {
                    rooms.delete(roomId);
                    console.log(`Room ${roomId} deleted.`);
                } else {
                    // Update remaining player's index if they become host
                    room.players[0].index = 1;
                    room.gameStarted = false;
                    broadcastLobbyState(roomId);
                }
            }
        }
    }
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
