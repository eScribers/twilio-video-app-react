import { useContext } from 'react';
import { StateContext } from '../../state/AppStateProvider';
import StateContextType from '../../types/stateContextType';

export function useAppState() {
  const context: StateContextType = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
