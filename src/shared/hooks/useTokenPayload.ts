import { useState } from 'react';
import { useToken } from './useToken';

//using hooks
export const useTokenPayload = () => {
  const { token, setToken } = useToken();

  const getPayloadFromToken = (token: string | undefined) => {
    if (!token) {
      return null;
    }

    try {
      const encodedPayload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(encodedPayload));
      return decodedPayload;
    } catch (error) {
      const error = new Error('Error decoding token payload');
      console.log(error);
      return null;
    }
  };

  //initial state
  const [tokenPayload, setTokenPayload] = useState(() => {
    return getPayloadFromToken(token);
  });

  return { tokenPayload };
};
