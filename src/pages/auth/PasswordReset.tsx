import React from 'react';
import { Form, useParams, useLoaderData, useActionData, Link } from 'react-router-dom';

import styles from './PasswordReset.module.css';
import { formDataLikeJsonApi } from '../../lib/helpers/formDataLikeJsonApi';
import { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';

// receives link from email
//step1. check if reset token still valid, if not, ask user to
export const PasswordReset = () => {
  const { token } = useParams();
  const loaderData = useLoaderData();
  const actionData = useActionData();
  let output;

  if(actionData?.meta?.status){
    output = (<div>password updated</div>)
    return output;
  }

  if (loaderData?.meta?.isResetTokenValid === false){ 
    output = (
      <div>
        token expired. request new reset password
        <Link to='/auth/password-init-reset'>link</Link>
      </div>
    );
  }
    
  else{
    output = (
      <div className={styles.wrapper}>
        <Form
          className={styles['form']}
          action={`/auth/password-reset/${token}`}
          method='POST'
        >
          <div className={styles['form-control']}>
            <label htmlFor='password'>new password</label>
            <input type='password' name='password' id='password' />
          </div>
          <div className={styles['form-control']}>
            <label htmlFor='confirmPassword'>Confirm password</label>
            <input
              type='password'
              name='confirmPassword'
              id='confirmPassword'
            />
          </div>

          <br />
          <div className={styles['form-control']}>
            {actionData?.errors &&
              actionData.errors.map((error, index) => {
                return <div key={index}>{error.title ? `${error.title}:`:''}{error.detail ? `${error.detail}`:''}</div>;
              })}
          </div>

          <div className={styles['form-buttons']}>
            <button type='submit'>Update</button>
          </div>
        </Form>
      </div>
    );
  } 

  return output;
};

export const loader = async ({ params }) => {
  const { token } = params;

  //make a call to server to check that token is still valid
  const URI = `${
    import.meta.env.VITE_BACKEND_URI
  }/auth/verify/reset/${token}`;

  const fetched = await fetch(URI, {
    method: 'GET',
  });

  const response: IJsonApiResponse = await fetched.json();
  return response;
};

export const action = async ({ request, params }) => {
  const data = await request.formData();

  const { token } = params;

  //limit what we send back to server by creating a new FormData() instance
  const formData = new FormData();
  formData.append('password', data.get('password'));

  const jsObject = formDataLikeJsonApi(formData, 'user');

  const URI = `${import.meta.env.VITE_BACKEND_URI}/auth/reset/${token}`;

  const fetched = await fetch(URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' }, //format of what we sending
    body: JSON.stringify(jsObject),
  });

  const response: IJsonApiResponse | undefined = await fetched.json();
  return response;
};
