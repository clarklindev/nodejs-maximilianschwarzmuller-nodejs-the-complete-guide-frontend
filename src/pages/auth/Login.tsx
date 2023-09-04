import React, { useEffect, useContext } from 'react';
import { NavLink, Form, useActionData, useNavigate } from 'react-router-dom';

import styles from './Login.module.css';
import { formDataLikeJsonApi } from '../../lib/helpers/formDataLikeJsonApi';
import type { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';
import { AuthContext } from '../../context/AuthContext';

export const Login = () => {
  const actionData = useActionData();
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
  if (actionData && actionData.meta && actionData.meta.token) {
    const token = actionData.meta.token;
    setToken(token);
    navigate('/');
  }
}, [actionData]);

  return (
    <div className={styles.wrapper}>
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
              return <div key={index}>{error.title}: {error.detail}</div>;
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
