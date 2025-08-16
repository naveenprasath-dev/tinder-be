const socket = require("socket.io");
const crypto = require("crypto");
const getSecretRoomId = (userId, targetId) => {
    return crypto.createHash("sha256").update([userId, targetId].sort().join("_"));
}
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });

    io.on("connection", (socket) => {
        // handle events.
        socket.on("joinChat", ({userId, targetId}) => {
            const roomId = getSecretRoomId(userId, targetId);
            socket.join(roomId);
        });

        socket.on("sendMessage", ({firstName, userId, targetUserId, text}) => {
             const roomId = getSecretRoomId(userId, targetId);
             io.to(roomId).emit("messageReceived", {firstName, text});
        });

        socket.on("disconnect", () => {

        });
    });
}


module.exports = initializeSocket;