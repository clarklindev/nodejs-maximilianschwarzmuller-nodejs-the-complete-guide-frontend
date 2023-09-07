import React, { createContext } from 'react';
import { useToken } from '../shared/hooks/useToken';

export const AuthContext = createContext({
  isTokenValid: false,
  setToken: (token: string) => {},
});

export const AuthContextProvider: React.FC = (props) => {
  const { setToken, isTokenValid } = useToken();

  //context
  const stuffToShare = {
    setToken,
    isTokenValid,
  };

  return <AuthContext.Provider value={stuffToShare}>{props.children}</AuthContext.Provider>;
};
