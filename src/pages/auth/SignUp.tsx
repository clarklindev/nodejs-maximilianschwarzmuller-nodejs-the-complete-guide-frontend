import React, { useEffect } from 'react';
import { NavLink, Form, useActionData, useNavigate } from 'react-router-dom';

import styles from './SignUp.module.css';
import { formDataLikeJsonApi } from '../../lib/helpers/formDataLikeJsonApi';
import type { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';
export const SignUp = () => {
  const actionData = useActionData();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData && actionData.meta && actionData.meta.token) {
      navigate('/auth/login');
    }
  }, [actionData]);

  return (
    <div className={styles.wrapper}>
      <Form className={styles['form']} action='/auth/signup' method='POST'>
        <div className={styles['form-control']}>
          <label htmlFor='username'>Username</label>
          <input type='text' name='username' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='confirmPassword'>Confirm password</label>
          <input type='password' name='confirmPassword' />
        </div>

        <br />

        <div className={styles['form-buttons']}>
          <button type='submit'>Sign up</button>
        </div>

        <br />
        <div className={styles['form-control']}>
          {actionData?.errors &&
            actionData.errors.map((error, index) => {
              return <div key={index}>{error.title}</div>;
            })}
        </div>
        <div>
          account already exists? <NavLink to='/auth/login'>Login</NavLink>
        </div>
      </Form>
    </div>
  );
};

export const action = async ({ request }) => {
  const data = await request.formData();

  //limit what we send back to server by creating a new FormData() instance
  const formData = new FormData();
  formData.append('username', data.get('username'));
  formData.append('email', data.get('email'));
  formData.append('password', data.get('password'));
  const jsObject = formDataLikeJsonApi(formData, 'user');

  const URI = `${import.meta.env.VITE_BACKEND_URI}/auth/signup`;

  const fetched = await fetch(URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' }, //format of what we sending
    body: JSON.stringify(jsObject), //stringify converts obj to JSON
  });

  const response: IJsonApiResponse | undefined = await fetched.json(); // Parse the JSON response body - returns js object

  return response;
};
