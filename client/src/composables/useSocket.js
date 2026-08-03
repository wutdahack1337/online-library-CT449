import { io } from 'socket.io-client';

let socket = null;
export function useSocket() {
  if (!socket) socket = io('/');
  return socket;
}