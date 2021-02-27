import React, { useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AlertType {
  id?: string;
  message: string;
  type: 'warn' | 'error' | 'info';
}

interface APIAlertContextProps {
  errors: AlertType[];
  setAlert: (data: AlertType) => void;
}

const APIAlertContext = React.createContext({} as APIAlertContextProps);

const initialState: AlertType[] = [];

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

  const setAlert = ({ message, type }: AlertType) => {
    const id = uuidv4();
    dispatch({
      type: 'SET_ALERT',
      payload: { id, message, type }
    });
    setTimeout(() => dispatch({ type: 'REMOVE_ALERT', payload: id }), 3000);
  };

  return (
    <APIAlertContext.Provider
      value={{
        errors,
        setAlert
      }}>
      {children}
    </APIAlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(APIAlertContext);
