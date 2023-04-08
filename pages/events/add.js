//! CLIENT SIDE AUTH
import Layout from '@/components/Layout';
import Link from 'next/link';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/Form.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '@/config';
import AuthContext from '@/context/AuthContext';
import NotFoundPage from '../404';

export default function AddEventPage({ token }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [values, setValues] = useState({
    name: '',
    performers: '',
    venue: '',
    address: '',
    date: '',
    time: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    // Object.values(values) gives an array full of values
    const hasEmptyFields = Object.values(values).some((ele) => ele === '');

    if (hasEmptyFields) {
      toast.error('Please fill in all fields');
    }

    const res = await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: values,
      }),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('No token included');
        return;
      }
      toast.error('Something went wrong :(', res);
    } else {
      const evt = await res.json();
      router.push(`/events/${evt.slug}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      {user && user.isAdmin ? (
        <>
          <NotFoundPage />
        </>
      ) : (
        <Layout title='Add New Event'>
          <h1>Add events page</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
              <div>
                <label htmlFor='name'>Event Name</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={values.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor='performers'>Performers</label>
                <input
                  type='text'
                  name='performers'
                  id='performers'
                  value={values.performers}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor='venue'>Venue</label>
                <input
                  type='text'
                  name='venue'
                  id='venue'
                  value={values.venue}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor='address'>Address</label>
                <input
                  type='text'
                  name='address'
                  id='address'
                  value={values.address}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor='date'>Date</label>
                <input
                  type='date'
                  name='date'
                  id='date'
                  value={values.date}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor='time'>Time</label>
                <input
                  type='text'
                  name='time'
                  id='time'
                  value={values.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor='description'>Event Description</label>
              <textarea
                type='text'
                name='description'
                id='description'
                value={values.description}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <input type='submit' value='Add Event' className='btn' />

            <ToastContainer theme='colored' />
          </form>
        </Layout>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      token: context.req.cookies.token,
    },
  };
}
