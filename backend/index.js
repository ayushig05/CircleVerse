const http = require("http");
const { Server } = require("socket.io");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
require("./db/conn");

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require("./app");
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: ({
        origin: [
            "http://localhost:5173", 
            "https://circle-verse.vercel.app"
        ],
        credentials: true,
      }),
});

global.io = io;

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server and Socket.IO running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
