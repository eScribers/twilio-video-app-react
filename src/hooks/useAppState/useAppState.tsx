import { useContext } from 'react';
import { StateContext } from '../../state/AppStateProvider';

export function useAppState(): any {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
