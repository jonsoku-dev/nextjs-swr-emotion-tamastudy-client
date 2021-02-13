import React, { useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ErrorType {
  id?: string;
  status?: number;
  message: string;
  type: 'warn' | 'error' | 'info';
}

interface APIErrorContextProps {
  errors: ErrorType[];
  setError: (data: ErrorType) => void;
}

const APIErrorContext = React.createContext({} as APIErrorContextProps);

const initialState: ErrorType[] = [];

const reducer = (state = initialState, action: any) => {
  const { payload, type } = action;
  switch (type) {
    case 'SET_ALERT':
      return [...state, payload];
    case 'REMOVE_ALERT':
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
};

export const APIErrorProvider: React.FC = ({ children }) => {
  const [errors, dispatch] = useReducer(reducer, initialState);

  const setError = ({ message, status, type }: ErrorType) => {
    const id = uuidv4();
    dispatch({
      type: 'SET_ALERT',
      payload: { id, message, status, type }
    });
    setTimeout(() => dispatch({ type: 'REMOVE_ALERT', payload: id }), 3000);
  };

  return (
    <APIErrorContext.Provider
      value={{
        errors,
        setError
      }}>
      {children}
    </APIErrorContext.Provider>
  );
};

export const useAlertContext = () => useContext(APIErrorContext);
