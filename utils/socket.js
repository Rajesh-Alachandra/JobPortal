import { Server } from "socket.io";

let io;

// Initialize Socket.IO
export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: function (origin, callback) {
                const allowedOrigins = [
                    "http://localhost:5174",
                ];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true
        },
    });

    // Listen for WebSocket connections
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Listen for potential connection errors
        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });

        // Handle custom events
        socket.on("newOrder", (data) => {
            console.log("New order received:", data);
            io.emit("newOrderPlaced", data); // Broadcast event
        });

        // Handle disconnections
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });

    // Handle graceful shutdown
    process.on("SIGINT", () => {
        io.close(() => {
            console.log("Socket.IO server closed");
            process.exit(0);
        });
    });

    return io;
};

// Get Socket.IO instance
export const getSocketInstance = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized. Call initializeSocket first.");
    }
    return io;
};
