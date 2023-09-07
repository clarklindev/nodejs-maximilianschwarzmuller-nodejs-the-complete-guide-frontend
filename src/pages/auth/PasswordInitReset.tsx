import React from 'react';
import { Form, NavLink, useActionData } from 'react-router-dom';

import styles from './PasswordInitReset.module.css';
import { formDataLikeJsonApi } from '../../lib/helpers/formDataLikeJsonApi';
import type { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';

export const PasswordInitReset = () => {
  const actionData = useActionData();

  if (actionData?.meta?.status) {
    return <div>we have sent you a reset email. please check your inbox</div>;
  }

  return (
    <div className={styles.wrapper}>
      <Form className={styles['form']} method="POST" action="/auth/password-init-reset">
        <div className={styles['form-control']}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div className={styles['form-buttons']}>
          <button type="submit">Reset</button>
        </div>
        <br />
        <div className={styles['form-control']}>
          {actionData?.errors &&
            actionData.errors.map((error, index) => {
              return (
                <div key={index}>
                  {error.title ? `${error.title}:` : ''}
                  {error.detail ? `${error.detail}` : ''}
                </div>
              );
            })}
        </div>
        <br />
        back to <NavLink to="/auth/login">login</NavLink>
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
    body: JSON.stringify(jsObject), //stringify converts obj to JSON
  });

  const response: IJsonApiResponse | undefined = await fetched.json();
  return response;
};
