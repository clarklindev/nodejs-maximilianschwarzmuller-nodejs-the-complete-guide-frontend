import React from 'react';
import { Form, NavLink, useActionData } from 'react-router-dom';

import styles from './SignUp.module.css';
import { formDataLikeJsonApi } from '../../lib/helpers/formDataLikeJsonApi';
import { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';

export const PasswordInitReset = () => {
  const data = useActionData();

  return (
    <div className={styles.wrapper}>
      <Form
        className={styles['form']}
        action='/auth/password-init-reset'
        method='POST'
      >
        <div className={styles['form-control']}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' />
        </div>
        <div className={styles['form-buttons']}>
          <button type='submit'>Reset</button>
        </div>
        <br />
        back to <NavLink to='/auth/login'>login</NavLink>
      </Form>
    </div>
  );
};

export const action = async ({ request }) => {
  const data = await request.formData();

  //limit what we send back to server by creating a new FormData() instance
  const formData = new FormData();
  formData.append('email', data.get('email'));
  const jsObject = formDataLikeJsonApi(formData, 'user');

  const URI = `${import.meta.env.VITE_BACKEND_URI}/auth/reset`;

  const fetched = await fetch(URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' }, //format of what we sending
    body: JSON.stringify(jsObject),
  });

  const response: IJsonApiResponse | undefined = await fetched.json();
  return response;
};
