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
      console.log('decodedPayload:', decodedPayload);
      return decodedPayload;
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return null;
    }
  };

  //initial state
  const [tokenPayload, setTokenPayload] = useState(() => {
    return getPayloadFromToken(token);
  });

  return { tokenPayload };
};
