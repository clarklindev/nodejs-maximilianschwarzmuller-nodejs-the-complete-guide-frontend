import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Form, useActionData, useNavigate } from 'react-router-dom';

import styles from './Login.module.css';
import { formDataLikeJsonApi } from '../../lib/helpers/formDataLikeJsonApi';
import type { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';
import { AuthContext } from '../../context/AuthContext';

export const Login = () => {
  const actionData = useActionData();
  const navigate = useNavigate();

  const { setToken } = useContext(AuthContext);
  const [googleOAuthUrl, setGoogleOAuthUrl] = useState('');


  useEffect(() => {
    if (actionData && actionData.meta && actionData.meta.token) {
      const token = actionData.meta.token;
      setToken(token);
      navigate('/');
    }
  }, [actionData]);

  useEffect(()=>{
    const loadOAuthUrl = async ()=>{
      try{
        const url:string = `${import.meta.env.VITE_BACKEND_URI}/auth/oauth/google/url`;
        const response = await fetch(url);

        const {url:googleOAuthUrl} = await response.json();
        setGoogleOAuthUrl(googleOAuthUrl);
      }
      catch(err:any){
        const error = new Error(err.message);
        throw error;
      }
    }
    loadOAuthUrl();
  },[]);

  const oAuthGoogleClickHandler = ()=>{
    // open in same window
    //window.location.href=googleOAuthUrl
    // Open a new window with the Google OAuth URL
    window.open(googleOAuthUrl, 'Google OAuth', 'width=500,height=600');
  }

  window.addEventListener('message', event => {
    // Check the event origin for security (event.origin)
    if (event.origin !== import.meta.env.VITE_BACKEND_URI) {
      return; // Ignore messages from untrusted origins
    }
  
    // Access the message data sent from the child window
    const token = event.data;
    if(token){
      setToken(token);
      navigate('/');
    }
  });

  return (
    <div className={styles.wrapper}>
      <button disabled={!googleOAuthUrl} onClick={oAuthGoogleClickHandler}>Login with google</button>

      {/* action= url to which the form will be submitted */}
      <Form className={styles['form']} action='/auth/login' method='POST'>
        <div className={styles['form-control']}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' id='password' />
        </div>
        <div>
          Forgot your password?{' '}
          <NavLink to='/auth/password-init-reset'>Reset password</NavLink>
        </div>

        <br />

        <div className={styles['form-buttons']}>
          <button type='submit'>Login</button>
        </div>

        <br />
        <div className={styles['form-control']}>
          {actionData?.errors &&
            actionData.errors.map((error, index) => {
              return <div key={index}>{error.title ? `${error.title}:`:''}{error.detail ? `${error.detail}`:''}</div>;
            })}
        </div>
        
        <div>
          Dont have an account? <NavLink to='/auth/signup'>Sign up</NavLink>
        </div>
      </Form>

    </div>
  );
};

export const action = async ({ request }) => {
  const data = await request.formData();

  //limit what we send back to server by creating a new FormData() instance
  const formData = new FormData();
  formData.append('email', data.get('email'));
  formData.append('password', data.get('password'));
  const jsObject = formDataLikeJsonApi(formData, 'user');

  const URI = `${import.meta.env.VITE_BACKEND_URI}/auth/login`;
  const fetched = await fetch(URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' }, //format of what we sending
    body: JSON.stringify(jsObject),
  });

  const response: IJsonApiResponse | undefined = await fetched.json();
  return response;
};
