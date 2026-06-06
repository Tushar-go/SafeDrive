import { DriveSession, DriveEvent } from '../types';
import { getDeduction, computeSafetyRating } from '../services/scoring';

export interface DriveState {
  isSessionActive: boolean;
  currentSession:  DriveSession | null;
  lastCompleted:   DriveSession | null;
  liveAccelMag:    number;
  liveGyroMag:     number;
}

export type DriveAction =
  | { type: 'START_DRIVE';   payload: { id: string; startTime: number } }
  | { type: 'LOG_EVENT';     payload: DriveEvent }
  | { type: 'END_DRIVE';     payload: { endTime: number; distanceMiles: number } }
  | { type: 'UPDATE_SENSORS';payload: { accelMag: number; gyroMag: number } }
  | { type: 'RESET' };

export const initialState: DriveState = {
  isSessionActive: false,
  currentSession:  null,
  lastCompleted:   null,
  liveAccelMag:    0,
  liveGyroMag:     0,
};

export function driveReducer(state: DriveState, action: DriveAction): DriveState {
  switch (action.type) {

    case 'START_DRIVE': {
      return {
        ...state,
        isSessionActive: true,
        currentSession: {
          id: action.payload.id,
          startTime: action.payload.startTime,
          events: [],
          finalScore: 100,
        },
        lastCompleted: null,
        liveAccelMag: 0,
        liveGyroMag:  0,
      };
    }

    case 'LOG_EVENT': {
      if (!state.currentSession) return state;
      const newScore = Math.max(
        0,
        state.currentSession.finalScore - getDeduction(action.payload.type)
      );
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          events:     [...state.currentSession.events, action.payload],
          finalScore: newScore,
        },
      };
    }

    case 'END_DRIVE': {
      if (!state.currentSession) return state;
      const { endTime, distanceMiles } = action.payload;
      const durationMs    = endTime - state.currentSession.startTime;
      const finalScore    = state.currentSession.finalScore;
      const safetyRating  = computeSafetyRating(finalScore);
      const completed: DriveSession = {
        ...state.currentSession,
        endTime, durationMs, finalScore, safetyRating, distanceMiles,
      };
      return {
        ...state,
        isSessionActive: false,
        currentSession:  null,
        lastCompleted:   completed,
      };
    }

    case 'UPDATE_SENSORS': {
      return {
        ...state,
        liveAccelMag: action.payload.accelMag,
        liveGyroMag:  action.payload.gyroMag,
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
