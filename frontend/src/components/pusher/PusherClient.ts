// PusherClient.ts
import Pusher from 'pusher-js';

const pusher = new Pusher('9321a8807cfb873ad040', {
  cluster: 'us2',
});

export default pusher;