// usePusher.ts
import { useEffect } from 'react';
import pusher from './PusherClient';

const usePusher = (
  channelName: string,
  eventName: string,
  callback: (data: any) => void
) => {
  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, callback]);
};

export default usePusher;