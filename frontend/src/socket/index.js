import { io } from "socket.io-client";

export const initSocket = () => {
    
    const options = {
        "force new connection": false,
        reconnectionAttempts: "Infinity",
        timeout: 10000,
        transport: ["websocket"],
    }


    const socket = io(process.env.REACT_APP_BACKEND_URL, {autoConnect: false});
    return socket;
}