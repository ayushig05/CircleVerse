import {  io } from "socket.io-client";
const API_URL = import.meta.env.VITE_BACKEND_API;

const socket = io(API_URL, {
    withCredentials: true,
});

export default socket;
