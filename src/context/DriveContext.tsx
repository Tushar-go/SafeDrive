import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DriveState, DriveAction, driveReducer, initialState } from './DriveReducer';

interface CtxType {
  state:    DriveState;
  dispatch: React.Dispatch<DriveAction>;
}

const DriveContext = createContext<CtxType | undefined>(undefined);

export function DriveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(driveReducer, initialState);
  return (
    <DriveContext.Provider value={{ state, dispatch }}>
      {children}
    </DriveContext.Provider>
  );
}

export function useDrive(): CtxType {
  const ctx = useContext(DriveContext);
  if (!ctx) throw new Error('useDrive must be used inside <DriveProvider>');
  return ctx;
}
