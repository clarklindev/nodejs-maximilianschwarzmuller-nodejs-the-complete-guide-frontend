import React from 'react';
import { Form, NavLink, useActionData } from 'react-router-dom';

import styles from './SignUp.module.css';
import { formDataLikeJsonApi } from '../../lib/helpers/formDataLikeJsonApi';
import type { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';

export const SignUp = () => {
  const actionData = useActionData();

  if (actionData?.meta?.message){
    return <div>you have successfully signed up. login <NavLink to="/auth/login">here</NavLink></div>
  }  

  return (
    <div className={styles.wrapper}>
      <Form 
        className={styles['form']} 
        method="POST" 
        action="/auth/signup"
      >
        <div className={styles['form-control']}>
          <label htmlFor='name'>name</label>
          <input type='text' name='name' />
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
              return <div key={index}>{error.title ? `${error.title}:`:''}{error.detail ? `${error.detail}`:''}</div>;
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
  formData.append('name', data.get('name'));
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
