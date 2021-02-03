import { useEffect, useState } from 'react';

export interface ISyncCommands {
  syncRoom: string;
  setSyncRoom: (syncRoom: string) => void;
}

const useSync = () => {
  const [syncRoom, setSyncRoom] = useState<string>('');

  useEffect(() => {
    // Check if room id isn't an empty string
    if (!syncRoom.length) return;
    console.log(`Error while setting roomId ${syncRoom}`);
    setSyncRoom(syncRoom);
  }, [syncRoom]);

  return [syncRoom, setSyncRoom] as const;
};

export default useSync;
