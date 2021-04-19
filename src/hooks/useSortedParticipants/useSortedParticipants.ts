import { useEffect, useState } from 'react';
import useParticipants from '../useParticipants/useParticipants';
import sortParticipants from '../../utils/sortParticipants';

export default function useSortedParticipants() {
  const unsortedParticipants = useParticipants();
  const [participants, setParticipants] = useState(sortParticipants(unsortedParticipants));

  useEffect(() => {
    const sortedParticipants = sortParticipants(unsortedParticipants);
    setParticipants(sortedParticipants);
  }, [unsortedParticipants]);

  return participants;
}
