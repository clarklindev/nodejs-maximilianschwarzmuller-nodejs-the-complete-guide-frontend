import React from 'react';
import type { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';
import { useLoaderData } from 'react-router-dom';

// signup email received an user clicks link to verify email.
export const VerifySignup = () => {
  //show loader when interacting with backend
  const loaderData = useLoaderData();

  const output = loaderData?.data?.attributes?.verified ? <div>you are now verified</div> : <div>token not valid</div>;
  return output;
};

export const loader = async ({ params }) => {
  const { token } = params;

  //make a call to server to check that token is still valid - this is the same token from signup
  const URI = `${import.meta.env.VITE_BACKEND_URI}/auth/verify/signup/${token}`;

  const fetched = await fetch(URI, {
    method: 'GET',
  });

  const response: IJsonApiResponse = await fetched.json();
  return response;
};
