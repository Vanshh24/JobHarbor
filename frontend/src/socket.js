import { io } from "socket.io-client";
import { apiBaseUrl } from "./config";

const socket = io(apiBaseUrl, {
  withCredentials: true,
});

export default socket;