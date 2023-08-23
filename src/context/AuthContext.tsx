import React, { createContext, useEffect, useState } from 'react';

import { useTokenPayload } from '../shared/hooks/useTokenPayload';
import { useToken } from '../shared/hooks/useToken';

export const AuthContext = createContext({
  isTokenValid: false,
  setToken: () => {},
  tokenPayload: {},
});

export const AuthContextProvider: React.FC = (props) => {
  const { token, setToken } = useToken();
  const { tokenPayload, _ } = useTokenPayload();
  const [isTokenValid, setIsTokenValid] = useState();

  const checkToken = async (token) => {
    //use server side to check token
    const URI = `${import.meta.env.VITE_BACKEND_URI}/auth/verify/${token}`;

    const fetched = await fetch(URI, {
      method: 'GET',
    });

    const response: IJsonApiResponse | undefined = await fetched.json(); // Parse the JSON response body - returns js object
    console.log('response: ', response);
  };

  useEffect(() => {
    const isValid = token ? checkToken(token) : false;
    if (!isValid) {
      setToken('');
    }
    setIsTokenValid(isValid);
  }, [token, checkToken]);

  //context
  const stuffToShare = {
    isTokenValid,
    setToken,
    tokenPayload,
  };

  return (
    <AuthContext.Provider value={stuffToShare}>
      {props.children}
    </AuthContext.Provider>
  );
};
