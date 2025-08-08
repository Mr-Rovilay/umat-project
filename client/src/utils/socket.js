import { io } from 'socket.io-client';
import { backend_url } from './server';

const socket = io(backend_url, {
  withCredentials: true,
  auth: {
    token: document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='))
      ?.split('=')[1],
  },
});

export default socket;