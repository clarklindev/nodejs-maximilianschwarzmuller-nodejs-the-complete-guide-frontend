import { useState, useEffect } from 'react';
import type { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';

export const useToken = () => {
  //------------------------------------------------------------------------

  //jwt token
  //get() token is from localstorage
  const [token, setTokenInternal] = useState(localStorage.getItem('token') || '');
  //set(token) sets localstorage AND sets state()
  const setToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setTokenInternal(newToken);
  };
  const [isTokenValid, setIsTokenValid] = useState(false);

  //check with backend if token is valid
  const checkToken = async (tokenToCheck: string) => {
    const URI = `${import.meta.env.VITE_BACKEND_URI}/auth/verify/login/${tokenToCheck}`;
    const fetched = await fetch(URI, {
      method: 'GET',
    });
    const response: IJsonApiResponse | undefined = await fetched.json(); // Parse the JSON response body - returns js object
    return response?.meta?.isLoginTokenValid; //backend server returns...meta.isLoginTokenValid
  };

  useEffect(() => {
    (async function () {
      token === '' ? setIsTokenValid(false) : setIsTokenValid(await checkToken(token));
    })();
  }, [token]);

  //------------------------------------------------------------------------

  return { setToken, isTokenValid };
};
