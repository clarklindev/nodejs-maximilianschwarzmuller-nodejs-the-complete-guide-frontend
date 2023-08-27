import React from 'react';
import { Form, redirect, useActionData } from 'react-router-dom';
import { formDataLikeJsonApi } from '../../lib/helpers/formDataLikeJsonApi';
import styles from './Contact.module.css';
export const Contact = () => {
  const data = useActionData();

  return (
    <>
      <h3>Contact</h3>
      <Form className={styles.form} method='post' action='/help/contact'>
        <label>
          <span>your email:</span>
          <input type='email' name='email' required />
        </label>
        <label>
          <span>your message:</span>
          <textarea name='message' required />
        </label>

        <button>Submit</button>

        {data && data.error && <p>{data.error}</p>}
      </Form>
    </>
  );
};

export const action = async ({ request }) => {
  console.log(request);

  const data = await request.formData();
  const formData = new FormData();
  formData.append('email', data.get('email'));
  formData.append('message', data.get('message'));

  const jsObject = formDataLikeJsonApi(formData, 'user');

  const URI = 'http:localhost:3000/contacts';

  const response = await fetch(URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' }, //format of what we sending
    body: JSON.stringify(jsObject),
  });

  console.log('FRONTEND response:', response);

  //redirect user
  return redirect('/');
};
