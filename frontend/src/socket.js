import { io } from "socket.io-client";

const socket = io("http://192.168.1.5:3000", {
  withCredentials: true,
});

export default socket;